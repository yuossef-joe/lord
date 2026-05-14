export interface Brand {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  logoUrl: string;
  description?: string;
  descriptionAr?: string;
  isAuthorizedDealer: boolean;
  isActive: boolean;
}

export interface ProductCategory {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
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
  keyAr?: string;
  value: string;
  valueAr?: string;
}

export interface Product {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  brand: Brand;
  category: ProductCategory;
  modelNumber: string;
  description: string;
  descriptionAr?: string;
  shortDescription?: string;
  shortDescriptionAr?: string;
  images: ProductImage[];
  price: number;
  salePrice?: number;
  stockQuantity: number;
  horsepower?: number;
  capacity: string;
  type: string;
  specifications: ProductSpecification[];
  features: string[];
  featuresAr?: string[];
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
  hp?: string;
  hpMin?: number;
  hpMax?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}
