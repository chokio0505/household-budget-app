import { api } from './api';
import { Purchase, PurchaseSummary } from '../../types/purchase';

export interface PurchaseFilters {
  year?: number;
  month?: number;
  category?: string;
}

export interface PurchaseListResponse {
  purchases: Purchase[];
  summary: PurchaseSummary;
}

export interface CreatePurchaseRequest {
  purchase: {
    name: string;
    amount: number;
    category: string;
    date: string; // YYYY-MM-DD format
    description?: string;
  };
}

export interface UpdatePurchaseRequest {
  purchase: {
    name?: string;
    amount?: number;
    category?: string;
    date?: string; // YYYY-MM-DD format
    description?: string;
  };
}

export const purchaseApi = {
  // 購入一覧取得（フィルタリング・サマリー付き）
  getList: async (filters?: PurchaseFilters): Promise<PurchaseListResponse> => {
    const params = new URLSearchParams();

    if (filters?.year !== undefined) {
      params.append('year', filters.year.toString());
    }
    if (filters?.month !== undefined) {
      params.append('month', filters.month.toString());
    }
    if (filters?.category) {
      params.append('category', filters.category);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/purchases?${queryString}` : '/purchases';

    const response = await api.get(endpoint);

    // データの変換（Rails APIからのレスポンスをフロントエンド用に調整）
    return {
      purchases: response.purchases.map((purchase: any) => ({
        ...purchase,
        date: new Date(purchase.date),
      })),
      summary: {
        totalAmount: response.summary.total_amount,
        itemCount: response.summary.item_count,
        categoryBreakdown: response.summary.category_breakdown,
      },
    };
  },

  // 購入詳細取得
  getById: async (id: string): Promise<Purchase> => {
    const response = await api.get(`/purchases/${id}`);
    return {
      ...response,
      date: new Date(response.date),
    };
  },

  // 購入作成
  create: async (purchaseData: Omit<Purchase, 'id'>): Promise<Purchase> => {
    const request: CreatePurchaseRequest = {
      purchase: {
        name: purchaseData.name,
        amount: purchaseData.amount,
        category: purchaseData.category,
        date: formatDateForApi(purchaseData.date),
        description: purchaseData.description,
      },
    };

    const response = await api.post('/purchases', request);
    return {
      ...response,
      date: new Date(response.date),
    };
  },

  // 購入更新
  update: async (
    id: string,
    purchaseData: Partial<Omit<Purchase, 'id'>>
  ): Promise<Purchase> => {
    const request: UpdatePurchaseRequest = {
      purchase: {},
    };

    if (purchaseData.name !== undefined) {
      request.purchase.name = purchaseData.name;
    }
    if (purchaseData.amount !== undefined) {
      request.purchase.amount = purchaseData.amount;
    }
    if (purchaseData.category !== undefined) {
      request.purchase.category = purchaseData.category;
    }
    if (purchaseData.date !== undefined) {
      request.purchase.date = formatDateForApi(purchaseData.date);
    }
    if (purchaseData.description !== undefined) {
      request.purchase.description = purchaseData.description;
    }

    const response = await api.patch(`/purchases/${id}`, request);
    return {
      ...response,
      date: new Date(response.date),
    };
  },

  // 購入削除
  delete: async (id: string): Promise<void> => {
    await api.delete(`/purchases/${id}`);
  },
};

// 日付をAPI用の文字列フォーマット（YYYY-MM-DD）に変換
function formatDateForApi(date: Date): string {
  return date.toISOString().split('T')[0];
}
