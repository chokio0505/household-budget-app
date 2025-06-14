import React from 'react';
import { Purchase, PurchaseSummary } from '../types/purchase';
import { PurchaseItem } from './PurchaseItem';

interface PurchaseListProps {
  purchases: Purchase[];
  summary: PurchaseSummary;
  onEditPurchase?: (purchase: Purchase) => void;
  onDeletePurchase?: (id: string) => void;
  loading?: boolean;
}

export const PurchaseList: React.FC<PurchaseListProps> = ({
  purchases,
  summary,
  onEditPurchase,
  onDeletePurchase,
  loading = false,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* サマリー情報 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          支出サマリー
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">合計支出</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(summary.totalAmount)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">購入件数</p>
            <p className="text-2xl font-bold text-green-600">
              {summary.itemCount}件
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">平均支出</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(
                summary.itemCount > 0
                  ? summary.totalAmount / summary.itemCount
                  : 0
              )}
            </p>
          </div>
        </div>

        {/* カテゴリー別内訳 */}
        {Object.keys(summary.categoryBreakdown).length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">カテゴリー別内訳</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(summary.categoryBreakdown).map(
                ([category, amount]) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-white rounded-full text-sm border"
                  >
                    {category}: {formatCurrency(amount)}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* 購入リスト */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          購入履歴 ({purchases.length}件)
        </h2>

        {purchases.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">まだ購入履歴がありません</p>
            <p className="text-sm">新しい購入を追加してみましょう</p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <PurchaseItem
                key={purchase.id}
                purchase={purchase}
                onEdit={onEditPurchase}
                onDelete={onDeletePurchase}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
