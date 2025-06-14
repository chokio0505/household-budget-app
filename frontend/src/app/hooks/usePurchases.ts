import { useState, useEffect, useCallback } from 'react';
import { Purchase, PurchaseSummary, FilterOptions } from '../../types/purchase';
import { purchaseApi, PurchaseFilters } from '../lib/purchaseApi';

interface UsePurchasesResult {
  purchases: Purchase[];
  summary: PurchaseSummary;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const usePurchases = (filters?: FilterOptions): UsePurchasesResult => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [summary, setSummary] = useState<PurchaseSummary>({
    totalAmount: 0,
    itemCount: 0,
    categoryBreakdown: {},
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiFilters: PurchaseFilters = {};
      
      if (filters) {
        if (filters.period === 'year') {
          apiFilters.year = filters.date.getFullYear();
        } else if (filters.period === 'month') {
          apiFilters.year = filters.date.getFullYear();
          apiFilters.month = filters.date.getMonth() + 1; // JSの月は0ベースなので+1
        }
        
        if (filters.category) {
          apiFilters.category = filters.category;
        }
      }

      const response = await purchaseApi.getList(apiFilters);
      setPurchases(response.purchases);
      setSummary(response.summary);
    } catch (err) {
      console.error('購入データの取得に失敗しました:', err);
      setError(err instanceof Error ? err.message : '購入データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  return {
    purchases,
    summary,
    loading,
    error,
    refetch: fetchPurchases,
  };
};

interface UsePurchaseOperationsResult {
  createPurchase: (purchaseData: Omit<Purchase, 'id'>) => Promise<void>;
  updatePurchase: (id: string, purchaseData: Partial<Omit<Purchase, 'id'>>) => Promise<void>;
  deletePurchase: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const usePurchaseOperations = (onSuccess?: () => void): UsePurchaseOperationsResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPurchase = useCallback(async (purchaseData: Omit<Purchase, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      await purchaseApi.create(purchaseData);
      onSuccess?.();
    } catch (err) {
      console.error('購入の作成に失敗しました:', err);
      setError(err instanceof Error ? err.message : '購入の作成に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  const updatePurchase = useCallback(async (id: string, purchaseData: Partial<Omit<Purchase, 'id'>>) => {
    try {
      setLoading(true);
      setError(null);
      await purchaseApi.update(id, purchaseData);
      onSuccess?.();
    } catch (err) {
      console.error('購入の更新に失敗しました:', err);
      setError(err instanceof Error ? err.message : '購入の更新に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  const deletePurchase = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await purchaseApi.delete(id);
      onSuccess?.();
    } catch (err) {
      console.error('購入の削除に失敗しました:', err);
      setError(err instanceof Error ? err.message : '購入の削除に失敗しました');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [onSuccess]);

  return {
    createPurchase,
    updatePurchase,
    deletePurchase,
    loading,
    error,
  };
};
