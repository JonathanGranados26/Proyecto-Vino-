// Tipos compartidos entre apps

export type Role = "USER" | "ADMIN" | "SOMMELIER";

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type ReservationStatus = "PENDING" | "CONFIRMED" | "EXPIRED" | "CANCELLED";

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  presentation: string;
  alcoholicDegree: number;
  price: number;
  currency: string;
  stock: number;
  country?: string;
  region?: string;
  tastingNotes?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface InventoryReservation {
  id: string;
  productId: string;
  quantity: number;
  expiresAt: string;
  status: ReservationStatus;
  userId?: string;
  sessionId?: string;
}