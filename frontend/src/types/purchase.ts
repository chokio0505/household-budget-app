export interface Purchase {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
  description?: string;
}

export interface PurchaseSummary {
  totalAmount: number;
  itemCount: number;
  categoryBreakdown: Record<string, number>;
}

export type PeriodType = 'month' | 'year';

export interface FilterOptions {
  period: PeriodType;
  date: Date;
  category?: string;
}

export interface PurchaseFormData {
  name: string;
  amount: string; // フォームでは文字列として扱う
  category: string;
  date: string; // フォームでは日付文字列として扱う
  description: string;
}

export interface ValidationErrors {
  name?: string;
  amount?: string;
  category?: string;
  date?: string;
  description?: string;
}

export const DEFAULT_CATEGORIES = [
  '食費',
  '交通費',
  '家電',
  '衣類',
  '医療費',
  '娯楽',
  '書籍',
  '光熱費',
  '通信費',
  'その他',
] as const;
