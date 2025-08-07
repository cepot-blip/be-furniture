import { CheckoutModels } from "../../../models/Models";
import prisma from "../../../models/prismaClient";
import * as Prisma from "@prisma/client";
import {
  handleAddress,
  createOrder,
  createOrderItems,
  createPayment,
  createShipping,
  createCheckoutRecord,
} from "./checkoutHelpers";
type Checkout = Prisma.Checkout;

class CheckoutService {
  #checkoutModel: typeof CheckoutModels;

  constructor(checkoutModel: typeof CheckoutModels) {
    this.#checkoutModel = checkoutModel;
  }

  async getCheckoutById(id: number): Promise<Checkout | null> {
    return await this.#checkoutModel.findUnique({
      where: { id },
    });
  }

  async getAllCheckouts(skip: number, limit: number): Promise<Checkout[]> {
    return await this.#checkoutModel.findMany({
      skip,
      take: limit,
      orderBy: { id: "desc" },
    });
  }

  async updateCheckoutById(
    id: number,
    data: Partial<Checkout>
  ): Promise<Checkout | null> {
    return await this.#checkoutModel.update({
      where: { id },
      data,
    });
  }

  async deleteCheckoutById(id: number): Promise<void> {
    await this.#checkoutModel.delete({
      where: { id },
    });
  }

  async countTotalCheckouts(): Promise<number> {
    return await this.#checkoutModel.count();
  }

  async createCheckoutWithTransaction({
    user_id,
    cart_id,
    address, // data address baru (optional)
    address_id, // id address lama 
    orderData,
    paymentData,
    shippingData,
    checkoutData,
  }: {
    user_id: number;
    cart_id: number;
    address?: any;
    address_id?: number;
    orderData: {
      total_price: any;
      status?: Prisma.OrderStatus;
      created_at?: Date;
      updated_at?: Date;
    };
    paymentData: {
      payment_method: Prisma.PaymentMethod;
      payment_status?: Prisma.PaymentStatus;
      payment_date: Date;
      amount: any;
      created_at?: Date;
      updated_at?: Date;
    };
    shippingData: {
      shipping_cost: any;
      shipping_date?: Date;
      status?: Prisma.ShippingStatus;
      created_at?: Date;
      updated_at?: Date;
    };
    checkoutData: {
      status?: Prisma.CheckoutStatus;
      total_price: any;
      created_at?: Date;
      updated_at?: Date;
    };
  }): Promise<Checkout> {
    if (!address_id && !address) {
      throw new Error("address_id atau address harus diisi");
    }

    return await prisma.$transaction(async (tx) => {
      const usedAddressId = await handleAddress(tx, {
        address,
        address_id,
        user_id,
      });

      // Create order
      const order = await createOrder(tx, { user_id, cart_id, orderData });

      // Create order items dari cart
      await createOrderItems(tx, order.id, cart_id);

      // Create payment
      const payment = await createPayment(tx, order.id, paymentData);

      // Create shipping
      const shipping = await createShipping(
        tx,
        order.id,
        usedAddressId,
        shippingData
      );

      // Create checkout
      const checkout = await createCheckoutRecord(tx, {
        user_id,
        cart_id,
        payment_id: payment.id,
        shipping_id: shipping.id,
        address_id: usedAddressId,
        checkoutData,
      });

      return checkout;
    });
  }
}

export default new CheckoutService(CheckoutModels);
