"use client";

import React, { useState } from 'react';
import {
  PurchaseFormData,
  ValidationErrors,
  Purchase,
  DEFAULT_CATEGORIES,
} from '../types/purchase';

interface PurchaseFormProps {
  onSubmit: (purchase: Omit<Purchase, 'id'>) => void;
  onCancel?: () => void;
  initialData?: Purchase;
  isLoading?: boolean;
}

export const PurchaseForm: React.FC<PurchaseFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<PurchaseFormData>({
    name: initialData?.name || '',
    amount: initialData?.amount?.toString() || '',
    category: initialData?.category || '',
    date: initialData?.date
      ? formatDateForInput(initialData.date)
      : getTodayString(),
    description: initialData?.description || '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // 商品名のバリデーション
    if (!formData.name.trim()) {
      newErrors.name = '商品名は必須です';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = '商品名は100文字以内で入力してください';
    }

    // 金額のバリデーション
    if (!formData.amount.trim()) {
      newErrors.amount = '金額は必須です';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = '金額は正の数値で入力してください';
      } else if (amount > 10000000) {
        newErrors.amount = '金額は1000万円以下で入力してください';
      }
    }

    // カテゴリーのバリデーション
    if (!formData.category.trim()) {
      newErrors.category = 'カテゴリーは必須です';
    }

    // 日付のバリデーション
    if (!formData.date) {
      newErrors.date = '日付は必須です';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date = '未来の日付は選択できません';
      }
    }

    // 説明のバリデーション（任意項目）
    if (formData.description && formData.description.length > 500) {
      newErrors.description = '説明は500文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const purchaseData: Omit<Purchase, 'id'> = {
      name: formData.name.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: new Date(formData.date),
      description: formData.description.trim() || undefined,
    };

    onSubmit(purchaseData);
  };

  const handleInputChange = (field: keyof PurchaseFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // エラーをクリア
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {initialData ? '購入を編集' : '新しい購入を追加'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 商品名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            商品名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="例: スーパーでの買い物"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* 金額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            金額 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`w-full px-3 py-2 pr-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
              min="0"
              step="1"
            />
            <span className="absolute right-3 top-2 text-gray-500">円</span>
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* カテゴリー */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            カテゴリー <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">カテゴリーを選択してください</option>
            {DEFAULT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* 日付 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            購入日 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* 説明 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            説明（任意）
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            rows={3}
            placeholder="購入した商品の詳細や補足情報"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* ボタン */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '処理中...' : initialData ? '更新' : '追加'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              キャンセル
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
