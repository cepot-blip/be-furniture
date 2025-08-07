import { Decimal } from "@prisma/client/runtime/library";

export async function handleAddress(tx: any, { address, address_id, user_id }: any) {
    let usedAddressId = address_id;
    if (address) {
        const newAddress = await tx.address.create({ data: { ...address, user_id } });
        usedAddressId = newAddress.id;
    } else if (address_id) {
        const addr = await tx.address.findUnique({ where: { id: address_id } });
        if (!addr || addr.user_id !== user_id) {
            throw new Error("address_id tidak valid untuk user ini");
        }
    }
    return usedAddressId;
}

export async function createOrder(tx: any, { user_id, cart_id, orderData }: any) {
    if (orderData.total_price === undefined || orderData.total_price === null) {
        throw new Error("total_price pada order wajib diisi");
    }
    return await tx.order.create({
        data: {
            user_id,
            cart_id,
            total_price: new Decimal(orderData.total_price),
            status: orderData.status || "Pending",
            created_at: orderData.created_at || new Date(),
            updated_at: orderData.updated_at || new Date()
        }
    });
}

export async function createOrderItems(tx: any, order_id: number, cart_id: number) {
    const cartItems = await tx.cartItem.findMany({ where: { cart_id } });
    for (const item of cartItems) {
        await tx.orderItem.create({
            data: {
                order_id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: new Decimal(item.subtotal_price),
                created_at: new Date(),
                updated_at: new Date()
            }
        });
    }
}

export async function createPayment(tx: any, order_id: number, paymentData: any) {
    if (paymentData.amount === undefined || paymentData.amount === null) {
        throw new Error("amount pada payment wajib diisi");
    }
    return await tx.payment.create({
        data: {
            order_id,
            payment_method: paymentData.payment_method,
            payment_status: paymentData.payment_status || "Pending",
            payment_date: paymentData.payment_date,
            amount: new Decimal(paymentData.amount),
            created_at: paymentData.created_at || new Date(),
            updated_at: paymentData.updated_at || new Date()
        }
    });
}

export async function createShipping(tx: any, order_id: number, address_id: number, shippingData: any) {
    if (shippingData.shipping_cost === undefined || shippingData.shipping_cost === null) {
        throw new Error("shipping_cost pada shipping wajib diisi");
    }
    return await tx.shipping.create({
        data: {
            order_id,
            address_id,
            shipping_cost: new Decimal(shippingData.shipping_cost),
            shipping_date: shippingData.shipping_date,
            status: shippingData.status || "Pending",
            created_at: shippingData.created_at || new Date(),
            updated_at: shippingData.updated_at || new Date()
        }
    });
}

export async function createCheckoutRecord(tx: any, { user_id, cart_id, payment_id, shipping_id, address_id, checkoutData }: any) {
    if (checkoutData.total_price === undefined || checkoutData.total_price === null) {
        throw new Error("total_price pada checkout wajib diisi");
    }
    return await tx.checkout.create({
        data: {
            user_id,
            cart_id,
            payment_id,
            shipping_id,
            address_id,
            status: checkoutData.status || "Pending",
            total_price: new Decimal(checkoutData.total_price),
            created_at: checkoutData.created_at || new Date(),
            updated_at: checkoutData.updated_at || new Date()
        }
    });
} 