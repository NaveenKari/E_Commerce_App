import { Product } from './product.model';

export interface Payment {
  paymentId: number;
  paymentMethod: string;
  pgPaymentId: string;
  pgStatus: string;
  pgResponseMessage: string;
  pgName: string;
}

export interface OrderItem {
  orderItemId: number;
  product: Product;
  quantity: number;
  discount: number;
  orderedProductPrice: number;
}

export interface Order {
  orderId: number;
  email: string;
  orderItems: OrderItem[];
  orderDate: string;
  payment: Payment;
  totalAmount: number;
  orderStatus: string;
  addressId: number;
}

export interface OrderRequest {
  addressId: number;
  paymentMethod: string;
  pgName: string;
  pgPaymentId: string;
  pgStatus: string;
  pgResponseMessage: string;
}
