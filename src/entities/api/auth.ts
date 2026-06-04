const BASE_URL = import.meta.env.VITE_HISTORICAL_API_URL || 'http://localhost:3000';

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role?: string;
}

export async function loginApi(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login gagal' }));
    throw new Error(error.message || 'Login gagal');
  }
  return response.json();
}

export async function getProfileApi(token: string): Promise<UserProfile> {
  const response = await fetch(`${BASE_URL}/api/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Sesi tidak valid, silakan login ulang');
  }
  return response.json();
}
