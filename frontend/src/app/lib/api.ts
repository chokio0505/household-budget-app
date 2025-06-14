const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'Network error' };
    }
    throw new ApiError(
      response.status,
      errorData.message || `HTTP ${response.status}`,
      errorData
    );
  }

  // 204 No Content の場合は空のレスポンスを返す
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`);
    return handleResponse(response);
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  patch: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
