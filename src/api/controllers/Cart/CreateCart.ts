import { Request, Response } from "express";
import CartValidation from "../../../validation/Cart";
import cartService from "../../../libs/services/Cart";
import NotFoundError from "../../../utils/exceptions/NotFoundError";
import userService from "../../../libs/services/Users";

interface CreateCartRequest extends Request {
  body: {
    user_id: number;
    total_price: number;
  };
}

export const createCart = async (
  req: CreateCartRequest,
  res: Response
): Promise<Response> => {
  const { user_id, total_price } = req.body;
  CartValidation.validatePayloadCart({
    user_id,
    total_price,
  });

  const checckUniqueUserId = await userService.getUserById(user_id);
  if (!checckUniqueUserId) {
    throw new NotFoundError("User id not found!");
  }

  const result = await cartService.createCart(user_id, total_price);
  return res.status(200).json({
    success: true,
    message: "Successfully create cart!",
    data: result 
  });
};
