import prisma from "./prismaClient";

export const UsersModels = prisma.user;
export const ProductsModels = prisma.product;
export const CategoriesModels = prisma.category;
export const OrdersModels = prisma.order;
export const OrderItemsModels = prisma.orderItem;
export const PaymentsModels = prisma.payment;
export const ReviewsModels = prisma.review;
export const CartsModels = prisma.cart;
export const CartItemsModels = prisma.cartItem;
export const ShippingModels = prisma.shipping;
export const AddressModels = prisma.address;
export const CheckoutModels = prisma.checkout;

