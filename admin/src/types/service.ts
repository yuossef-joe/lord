export interface ServiceType {
  id: string;
  name: string;
  icon?: string;
}

export interface Service {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  type: ServiceType;
  description?: string;
  descriptionAr?: string;
  scopeOfWork: string[];
  applicableUnitTypes: string[];
  estimatedDuration?: string;
  pricingType?: string;
  price?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
