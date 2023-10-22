export interface HouseEntry {
  link: string;
  address: string;
  price: Price;
}

export interface Price {
  currency: string;
  amount: number;
  precision: number;
}
