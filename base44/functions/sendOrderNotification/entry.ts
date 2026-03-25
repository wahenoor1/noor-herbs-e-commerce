import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const payload = await req.json();

        const order = payload.data;
        if (!order) {
            return Response.json({ error: 'No order data' }, { status: 400 });
        }

        const itemsList = (order.items || [])
            .map(item => `- ${item.product_name} x${item.quantity} = ₹${item.price * item.quantity}`)
            .join('\n');

        const emailBody = `
New Order Received! 🎉

Order Number: ${order.order_number || 'N/A'}
Date: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Calcutta' })}

Customer Details:
Name: ${order.customer_name}
Phone: ${order.customer_phone}
Email: ${order.customer_email || 'N/A'}

Shipping Address:
${order.shipping_address}, ${order.city}, ${order.state || ''} - ${order.pincode}

Items Ordered:
${itemsList}

Subtotal: ₹${order.subtotal}
Shipping: ₹${order.shipping_cost || 0}
Total: ₹${order.total}

Payment Method: ${order.payment_method === 'cod' ? 'Cash on Delivery' : 'Prepaid'}
Status: ${order.status}
        `.trim();

        await base44.asServiceRole.integrations.Core.SendEmail({
            to: 'wahenoorenterprises@gmail.com',
            subject: `New Order ${order.order_number || ''} - ₹${order.total} from ${order.customer_name}`,
            body: emailBody
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});