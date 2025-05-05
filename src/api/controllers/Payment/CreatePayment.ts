import { Request, Response } from "express";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { createPaymentSchema } from "../../../validation/Payment/schema"
import PaymentService from "../../../libs/services/Payment";
import PaymentValidator from "../../../validation/Payment";
import InvariantError from "../../../utils/exceptions/InvariantError";
import NotFoundError from "../../../utils/exceptions/NotFoundError";
import OrderService from "../../../libs/services/Order";
import moment from "moment";

interface createPaymentRequest extends Request {
  body: {
    order_id: number;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    payment_date: Date;
    amount: number;
  };
}

export const createPayment = async (
  req: createPaymentRequest,
  res: Response
): Promise<Response> => {
  const { order_id, payment_method, payment_status, payment_date, amount } =
    req.body;

  const { error } = createPaymentSchema.validate(req.body);
  if (error) {
    throw new InvariantError(error.details[0].message);
  }

  const checkOrderId = await OrderService.getOrderById(order_id);
  if (!checkOrderId) {
    throw new NotFoundError("order ID not found!")
  }

  const formatedPaymentDate = moment(payment_date).toDate();

  PaymentValidator.validatePaymentPayload({
    order_id,
    payment_method,
    payment_status,
    payment_date: formatedPaymentDate,
    amount,
  });

  const response = await PaymentService.createPayment(
    order_id,
    payment_method,
    payment_status,
    formatedPaymentDate,
    amount
  );

  return res.status(200).json({
    success: true,
    message: "Payment created successfully",
    data: response,
  });
};
