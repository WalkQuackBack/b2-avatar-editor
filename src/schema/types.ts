export interface Accessory {
  name: string;
  id: string;
  image: string;
  cost: number;
  supportsPrimaryColor: boolean;
  supportsSecondaryColor: boolean;
  supportsTertiaryColor: boolean;
}

export interface Category {
  name: string;
  id: string;
  image: string;
}
