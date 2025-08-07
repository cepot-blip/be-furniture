import Joi from "joi";

const paymentMethod = [
  "Credit_Card",
  "Bank_Transfer",
  "E_Wallet",
  "Cash_on_Delivery",
];
const paymentStatus = ["Pending", "Completed", "Failed"];

const createPaymentSchema = Joi.object({
  order_id: Joi.number().required(),
  payment_method: Joi.string()
    .valid(...paymentMethod)
    .required()
    .messages({
      "any-required": "Metode Pembayaran wajib diisi",
      "any-only": `Metode pembayaran harus salah satu dari ${paymentMethod.join(", ")}`,
    }),

  payment_status: Joi.string()
    .valid(...paymentStatus)
    .required()
    .messages({
      "any-required": "Status wajib diisi",
      "any-only": `Status pembayaran harus salah satu dari ${paymentStatus.join(", ")}`,
    }),

  payment_date: Joi.date().required(),
  amount: Joi.number().positive().required(),
});

const updatePaymentSchema = Joi.object({
  id: Joi.number().required(),
  order_id: Joi.number().optional(),
  payment_method: Joi.string()
    .valid(...paymentMethod)
    .optional(),

  payment_status: Joi.string()
    .valid(...paymentStatus)
    .optional(),

  payment_date: Joi.date().optional(),
  amount: Joi.number().positive().required(),
});

export { createPaymentSchema, updatePaymentSchema };
