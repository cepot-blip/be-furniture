import { Request, Response } from "express";
import cartItemService from "../../../libs/services/CartItem";
import NotFoundError from "../../../utils/exceptions/NotFoundError";
import CartItemValidation from "../../../validation/CartItem";
import productService from "../../../libs/services/Product";
import cartService from "../../../libs/services/Cart";

export const updateCartItem = async (req: Request, res: Response) => {
  const { id, cart_id, product_id, quantity, subtotal_price } = req.body;

  CartItemValidation.validationUpdateCartItem({
    id,
    cart_id,
    product_id,
    quantity,
    subtotal_price,
  });

  const checkUniqueId = await cartItemService.getCartItemById(id);

  if (!checkUniqueId) {
    throw new NotFoundError("Id not found!");
  }

  const checkCartId = await cartService.getCartById(cart_id);

  if (!checkCartId) {
    throw new NotFoundError("Cart id not found!");
  }

  const checkProductId = await productService.getProductById(product_id);

  if (!checkProductId) {
    throw new NotFoundError("Product id not found!");
  }

  const result = await cartItemService.updateCartItemById(parseInt(id), {
    id,
    cart_id,
    product_id,
    quantity,
    subtotal_price,
  });
  return res.status(200).json({
    status: true,
    message: "Successfully updated cart item!",
    data: result,
  });
};
