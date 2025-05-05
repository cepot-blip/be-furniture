import { Request, Response } from "express";
import { OrderStatus } from "@prisma/client";
import OrderService from "../../../libs/services/Order";
import OrderValidator from "../../../validation/Order";
import InvariantError from "../../../utils/exceptions/InvariantError";
import cartService from "../../../libs/services/Cart";
import userService from "../../../libs/services/Users";

interface CreateOrderRequest extends Request {
  body: {
    user_id: number;
    cart_id: number;
    total_price: number;
    status: OrderStatus;
  };
}

export const createOrder = async (
  req: CreateOrderRequest,
  res: Response
): Promise<Response> => {
  const { user_id, cart_id, total_price, status } = req.body;

  OrderValidator.validateOrderPayload({
    user_id,
    cart_id,
    total_price,
    status,
  });

  const checkUniqueUserId = await userService.getUserById(user_id);

  const checkUniqueCartId = await cartService.getCartById(cart_id);

  if (!checkUniqueUserId) {
    throw new InvariantError("User id not found!");
  }

  if (!checkUniqueCartId) {
    throw new InvariantError("Cart id not found!");
  }

  const response = await OrderService.createOrder(user_id, cart_id, total_price, status);
  return res.status(201).json({
    success: true,
    message: "Successfully create order!",
    data: response,
  });
};
