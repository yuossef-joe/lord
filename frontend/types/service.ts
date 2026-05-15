export interface ServiceType {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  isActive: boolean;
}

export interface Service {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  serviceType: ServiceType;
  description: string;
  descriptionAr?: string;
  shortDescription?: string;
  shortDescriptionAr?: string;
  iconName: string;
  inclusions: string[];
  inclusionsAr?: string[];
  applicableTypes: string[];
  price?: number;
  isActive: boolean;
  sortOrder: number;
}
