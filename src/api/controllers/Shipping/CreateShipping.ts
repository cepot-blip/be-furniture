import { ShippingStatus } from "@prisma/client";
import { Request, Response } from "express";
import ShippingValidator from "../../../validation/Shipping";
import OrderService from "../../../libs/services/Order";
import ShippingService from "../../../libs/services/Shipping";
import NotFoundError from "../../../utils/exceptions/NotFoundError";
import addressService from "../../../libs/services/Address";
interface ShippingRequest extends Request {
  body: {
    order_id: number;
    address_id: number;
    shipping_cost: number;
    shipping_date: Date;
    status: ShippingStatus;
  };
}

export const createShipping = async (
  req: ShippingRequest,
  res: Response
): Promise<Response> => {
  const { order_id, address_id, shipping_cost, shipping_date, status } =
    req.body;
  ShippingValidator.validateCreateShippingPayLoad({
    order_id,
    address_id,
    shipping_cost,
    shipping_date,
    status,
  });

  const checkOrderId = await OrderService.getOrderById(order_id);
  if (!checkOrderId) {
    throw new NotFoundError("Order id not found!");
  }

  const checkOrderShipping = await ShippingService.getShippingById(order_id);
  if (checkOrderShipping) {
    throw new NotFoundError("Order id already exist!");
  }

  const checkAddressId = await addressService.getAddressById(address_id);

  if (!checkAddressId) {
    throw new Error("Address id not found!");
  }

  const response = await ShippingService.createShipping(
    order_id,
    address_id,
    shipping_cost,
    shipping_date,
    status
  );

  return res.status(200).json({
    success: true,
    message: "Successfully create shipping!",
    data: response,
  });
};
