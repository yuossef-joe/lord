export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logoUrl: string;
  description?: string;
  isAuthorizedDealer: boolean;
  isActive: boolean;
}

export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: Brand;
  category: ProductCategory;
  modelNumber: string;
  description: string;
  shortDescription?: string;
  images: ProductImage[];
  price: number;
  salePrice?: number;
  stockQuantity: number;
  capacity: string;
  type: string;
  specifications: ProductSpecification[];
  features: string[];
  warranty: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  brand?: string;
  category?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  capacity?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}
