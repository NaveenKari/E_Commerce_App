import { Product } from './product.model';

export interface Cart {
  cartId: number;
  totalPrice: number;
  products: Product[];
}
