'use client';

import React, { useState } from 'react';
import { Purchase, FilterOptions } from '../types/purchase';
import { PurchaseList } from './PurchaseList';
import { PeriodFilter } from './PeriodFilter';
import { PurchaseForm } from './PurchaseForm';
import { Modal } from './Modal';
import { usePurchases, usePurchaseOperations } from '../app/hooks/usePurchases';

interface PurchaseManagementWithApiProps {
  // API連携版では外部からのpropsは不要
}

export const PurchaseManagementWithApi: React.FC<
  PurchaseManagementWithApiProps
> = () => {
  const [filter, setFilter] = useState<FilterOptions>({
    period: 'month',
    date: new Date(),
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // API連携フック
  const { purchases, summary, loading, error, refetch } = usePurchases(filter);
  const {
    createPurchase,
    updatePurchase,
    deletePurchase,
    loading: operationLoading,
    error: operationError,
  } = usePurchaseOperations(handleOperationSuccess);

  function handleOperationSuccess() {
    setIsFormModalOpen(false);
    setEditingPurchase(null);
    refetch(); // データを再取得
  }

  // フォーム処理のハンドラー
  const handleAddPurchase = () => {
    setEditingPurchase(null);
    setIsFormModalOpen(true);
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (purchaseData: Omit<Purchase, 'id'>) => {
    try {
      setIsFormLoading(true);

      if (editingPurchase) {
        // 編集の場合
        await updatePurchase(editingPurchase.id, purchaseData);
      } else {
        // 新規追加の場合
        await createPurchase(purchaseData);
      }
    } catch (error) {
      // エラーはusePurchaseOperationsで処理済み
      console.error('Form submission error:', error);
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setEditingPurchase(null);
  };

  const handleDeletePurchase = async (id: string) => {
    if (window.confirm('この購入を削除しますか？')) {
      try {
        await deletePurchase(id);
      } catch (error) {
        // エラーはusePurchaseOperationsで処理済み
        console.error('Delete error:', error);
      }
    }
  };

  // 期間タイトルのフォーマット
  const formatPeriodTitle = () => {
    const date = filter.date;
    if (filter.period === 'month') {
      return `${date.getFullYear()}年${date.getMonth() + 1}月の支出`;
    } else {
      return `${date.getFullYear()}年の支出`;
    }
  };

  // エラー表示
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={refetch}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">家計簿管理</h1>
        <button
          onClick={handleAddPurchase}
          disabled={operationLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + 新しい購入を追加
        </button>
      </div>

      {/* 操作エラー表示 */}
      {operationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{operationError}</p>
        </div>
      )}

      {/* 期間タイトル */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {formatPeriodTitle()}
        </h2>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* フィルター */}
        <div className="lg:col-span-1">
          <PeriodFilter currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* 購入リスト */}
        <div className="lg:col-span-3">
          <PurchaseList
            purchases={purchases}
            summary={summary}
            loading={loading}
            onEditPurchase={handleEditPurchase}
            onDeletePurchase={handleDeletePurchase}
          />
        </div>
      </div>

      {/* フォームモーダル */}
      <Modal isOpen={isFormModalOpen} onClose={handleFormCancel} size="lg">
        <PurchaseForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editingPurchase || undefined}
          isLoading={isFormLoading}
        />
      </Modal>
    </div>
  );
};
