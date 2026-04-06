export interface ServiceType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface Service {
  _id: string;
  name: string;
  slug: string;
  serviceType: ServiceType;
  description: string;
  shortDescription?: string;
  iconName: string;
  inclusions: string[];
  applicableTypes: string[];
  price?: number;
  isActive: boolean;
  sortOrder: number;
}
