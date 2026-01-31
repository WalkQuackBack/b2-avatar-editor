export interface AccessoryVariant {
  name: string;
  idSuffix: string;
  image?: string;
}

export interface Accessory {
  name: string;
  id: string;
  image: string;
  cost: number;
  supportsPrimaryColor: boolean;
  supportsSecondaryColor: boolean;
  supportsTertiaryColor: boolean;
  variants?: AccessoryVariant[];
}

export interface Category {
  name: string;
  id: string;
  image: string;
}
