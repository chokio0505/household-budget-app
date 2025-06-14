import React, { useState, useMemo } from 'react';
import { Purchase, FilterOptions, PurchaseSummary } from '../types/purchase';
import { PurchaseList } from './PurchaseList';
import { PeriodFilter } from './PeriodFilter';
import { PurchaseForm } from './PurchaseForm';
import { Modal } from './Modal';

interface PurchaseManagementProps {
  purchases: Purchase[];
  onEditPurchase?: (purchase: Omit<Purchase, 'id'>, id?: string) => void;
  onDeletePurchase?: (id: string) => void;
  onAddPurchase?: (purchase: Omit<Purchase, 'id'>) => void;
}

export const PurchaseManagement: React.FC<PurchaseManagementProps> = ({
  purchases,
  onEditPurchase,
  onDeletePurchase,
  onAddPurchase,
}) => {
  const [filter, setFilter] = useState<FilterOptions>({
    period: 'month',
    date: new Date(),
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);

  // フィルタリングされた購入データ
  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.date);
      const filterDate = filter.date;

      if (filter.period === 'month') {
        return (
          purchaseDate.getFullYear() === filterDate.getFullYear() &&
          purchaseDate.getMonth() === filterDate.getMonth()
        );
      } else {
        return purchaseDate.getFullYear() === filterDate.getFullYear();
      }
    });
  }, [purchases, filter]);

  // サマリー計算
  const summary = useMemo((): PurchaseSummary => {
    const totalAmount = filteredPurchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );
    const itemCount = filteredPurchases.length;

    const categoryBreakdown = filteredPurchases.reduce((acc, purchase) => {
      acc[purchase.category] = (acc[purchase.category] || 0) + purchase.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAmount,
      itemCount,
      categoryBreakdown,
    };
  }, [filteredPurchases]);

  const formatPeriodTitle = () => {
    const year = filter.date.getFullYear();
    const month = filter.date.getMonth() + 1;

    if (filter.period === 'month') {
      return `${year}年${month}月の支出`;
    } else {
      return `${year}年の支出`;
    }
  };

  // フォーム処理のハンドラー
  const handleAddPurchase = () => {
    setEditingPurchase(null);
    setIsFormModalOpen(true);
  };

  const handleEditPurchase = (purchase: Purchase) => {
    setEditingPurchase(purchase);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (purchaseData: Omit<Purchase, 'id'>) => {
    if (editingPurchase) {
      // 編集の場合
      onEditPurchase?.(purchaseData, editingPurchase.id);
    } else {
      // 新規追加の場合
      onAddPurchase?.(purchaseData);
    }
    setIsFormModalOpen(false);
    setEditingPurchase(null);
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setEditingPurchase(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">家計簿管理</h1>
        {onAddPurchase && (
          <button
            onClick={handleAddPurchase}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + 新しい購入を追加
          </button>
        )}
      </div>

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
            purchases={filteredPurchases}
            summary={summary}
            onEditPurchase={handleEditPurchase}
            onDeletePurchase={onDeletePurchase}
          />
        </div>
      </div>

      {/* フォームモーダル */}
      <Modal isOpen={isFormModalOpen} onClose={handleFormCancel} size="lg">
        <PurchaseForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          initialData={editingPurchase || undefined}
        />
      </Modal>
    </div>
  );
};
