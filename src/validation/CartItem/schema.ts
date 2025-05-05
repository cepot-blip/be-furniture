import Joi from "joi";

const createCartItemSchema = Joi.object({
    cart_id: Joi.number().required(),
    product_id: Joi.number().required(), 
     quantity: Joi.number().required(),
     subtotal_price: Joi.number().required()
});

const updateCartItemSchema = Joi.object({
    id: Joi.number().required(),
    cart_id: Joi.number().optional(),
    product_id: Joi.number().optional(), 
    quantity: Joi.number().optional(),
    subtotal_price: Joi.number().optional()
});

const getAllCartItemSchema = Joi.object({
    cart_id: Joi.number().optional(),
    product_id: Joi.number().optional(), 
    quantity: Joi.number().optional(),
    subtotal_price: Joi.number().optional()
});



export {
    createCartItemSchema,
    getAllCartItemSchema,
    updateCartItemSchema
}