export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  revenueToday: number;
  revenueYesterday: number;
  newOrdersToday: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  newInquiriesToday: number;
  outOfStockCount: number;
  carrierProducts: number;
  mideaProducts: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface SelectOption {
  label: string;
  value: string;
}
