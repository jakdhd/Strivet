const API = '/api';

export async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers: optHeaders, ...rest } = options || {};
  const res = await fetch(`${API}${path}`, {
    ...rest,
    headers: { 'Content-Type': 'application/json', ...optHeaders },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error);
  }
  return res.json();
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('strive_token');
}

export function setToken(token: string) {
  localStorage.setItem('strive_token', token);
}

export function clearToken() {
  localStorage.removeItem('strive_token');
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
