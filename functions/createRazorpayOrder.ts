import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { amount, currency = "INR", receipt } = await req.json();
        
        if (!amount || !receipt) {
            return Response.json({ error: 'Missing required fields: amount, receipt' }, { status: 400 });
        }
        
        const keyId = Deno.env.get("RAZORPAY_KEY_ID");
        const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
        
        if (!keyId || !keySecret) {
            return Response.json({ error: 'Razorpay credentials not configured' }, { status: 500 });
        }
        
        // Create Razorpay order
        const basicAuth = btoa(`${keyId}:${keySecret}`);
        const response = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount * 100, // Convert to paise
                currency: currency,
                receipt: receipt,
                notes: {
                    created_via: 'Noor Herbs E-commerce'
                }
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            console.error('Razorpay API error:', result);
            return Response.json({ error: 'Failed to create order', details: result }, { status: response.status });
        }
        
        return Response.json({ 
            success: true, 
            orderId: result.id,
            amount: result.amount,
            currency: result.currency
        });
        
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});