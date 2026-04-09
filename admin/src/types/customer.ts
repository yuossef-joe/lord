export interface CustomerAddress {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  governorate: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  name: string;
  nationalId?: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  isActive: boolean;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  lastLoginAt?: string;
  addresses: CustomerAddress[];
  createdAt: string;
  updatedAt: string;
}
