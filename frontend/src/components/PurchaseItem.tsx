import React from 'react';
import { Purchase } from '../types/purchase';

interface PurchaseItemProps {
  purchase: Purchase;
  onEdit?: (purchase: Purchase) => void;
  onDelete?: (id: string) => void;
}

export const PurchaseItem: React.FC<PurchaseItemProps> = ({
  purchase,
  onEdit,
  onDelete,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{purchase.name}</h3>
        <span className="text-xl font-bold text-blue-600">
          {formatCurrency(purchase.amount)}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span className="bg-gray-100 px-2 py-1 rounded-full">
          {purchase.category}
        </span>
        <span>{formatDate(purchase.date)}</span>
      </div>

      {purchase.description && (
        <p className="text-sm text-gray-700 mb-3">{purchase.description}</p>
      )}

      {(onEdit || onDelete) && (
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(purchase)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              編集
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(purchase.id)}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              削除
            </button>
          )}
        </div>
      )}
    </div>
  );
};
