export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  _id: string;
  label: "home" | "office" | "other";
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  governorate: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface RegisterData {
  name: string;
  nationalId: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  customer: Customer;
}
