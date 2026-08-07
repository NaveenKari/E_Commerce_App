export interface Address {
  addressId: number;
  street: string;
  buildingName: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export type AddressInput = Omit<Address, 'addressId'>;
