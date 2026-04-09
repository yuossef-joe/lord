export interface Brand {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  logoUrl?: string;
  certificateUrl?: string;
  description?: string;
  descriptionAr?: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  icon?: string;
  description?: string;
  descriptionAr?: string;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  order: number;
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  brand: Brand;
  category: ProductCategory;
  name: string;
  slug: string;
  modelNumber: string;
  type: string;
  capacity?: number;
  capacityUnit?: string;
  eerSeer?: string;
  voltage?: string;
  refrigerant?: string;
  dimensionsJson?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weightJson?: { indoor: number; outdoor: number; unit: string };
  color?: string;
  shortDescription?: string;
  description?: string;
  features?: string[];
  specifications?: ProductSpecification[];
  price: number;
  originalPrice?: number;
  currency: string;
  stockQuantity: number;
  images: ProductImage[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  isActive: boolean;
  seo?: { metaTitle?: string; metaDescription?: string };
  createdAt: string;
  updatedAt: string;
}
