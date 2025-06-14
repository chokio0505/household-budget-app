const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`);
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/v1${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
