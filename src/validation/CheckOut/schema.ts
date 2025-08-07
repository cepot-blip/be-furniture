import joi from "joi";

const checkoutStatus = ["Pending", "Completed", "Failed", "Cancelled"];

const createCheckoutSchema = joi.object({
    user_id: joi.number().required(),
    cart_id: joi.number().required(),
    address_id: joi.number(),
    address: joi.object(),
    orderData: joi.object().required(),
    paymentData: joi.object().required(),
    shippingData: joi.object().required(),
    checkoutData: joi.object().required(),
}).or('address_id','address').messages({
    'object.missing': 'Minimal salah satu dari address_id atau address harus diisi'
});

const updateCheckoutSchema = joi.object({
    id: joi.number().required().messages({
        "number.base": "ID harus berupa angka",
        "any.required": "ID harus diisi"
    }),
    status: joi.string().valid(...checkoutStatus).required().messages({
        "string.base": "Status harus berupa string",
        "any.required": "Status harus diisi",
        "any.only": `Status harus salah satu dari ${checkoutStatus.join(", ")}`
    }),
});

export { createCheckoutSchema, updateCheckoutSchema };