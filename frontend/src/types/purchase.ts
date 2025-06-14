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
