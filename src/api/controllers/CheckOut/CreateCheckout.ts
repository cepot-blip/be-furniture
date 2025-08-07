import { Request, Response } from "express";
import { createCheckoutSchema } from "../../../validation/CheckOut/schema";
import InvariantError from "../../../utils/exceptions/InvariantError";
import NotFoundError from "../../../utils/exceptions/NotFoundError";
import CheckoutService from "../../../libs/services/CheckOut";
import userService from "../../../libs/services/Users";
import cartService from "../../../libs/services/Cart";

export const createCheckout = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { error } = createCheckoutSchema.validate(req.body);
  if (error) {
    throw new InvariantError(error.details[0].message);
  }

  const {
    user_id,
    cart_id,
    address,
    address_id,
    orderData,
    paymentData,
    shippingData,
    checkoutData,
  } = req.body;

  const checkUserId = await userService.getUserById(user_id);
  if (!checkUserId) {
    throw new NotFoundError("User ID not found!");
  }
  const checkCartId = await cartService.getCartById(cart_id);
  if (!checkCartId) {
    throw new NotFoundError("Cart ID not found!");
  }

  const result = await CheckoutService.createCheckoutWithTransaction({
    user_id,
    cart_id,
    address,
    address_id,
    orderData,
    paymentData,
    shippingData,
    checkoutData,
  });

  return res.status(201).json({
    success: true,
    message: "Checkout created successfully",
    data: result,
  });
};
