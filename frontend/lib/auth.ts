// Auth helpers for token management

const TOKEN_KEY = "customerToken";
const REFRESH_TOKEN_KEY = "customerRefreshToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// Decode JWT to check expiry (without external library)
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiresAt = payload.exp * 1000;
    // Consider expired if less than 60 seconds remaining
    return Date.now() >= expiresAt - 60000;
  } catch {
    return true;
  }
}

// Get customer data from token payload
export function getTokenPayload(
  token: string,
): { customerId: string; email: string } | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { customerId: payload.sub || payload.id, email: payload.email };
  } catch {
    return null;
  }
}
