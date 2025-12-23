import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
        
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
        
        if (!keySecret) {
            return Response.json({ error: 'Razorpay secret not configured' }, { status: 500 });
        }
        
        // Verify signature
        const text = `${razorpay_order_id}|${razorpay_payment_id}`;
        const encoder = new TextEncoder();
        const keyData = encoder.encode(keySecret);
        const messageData = encoder.encode(text);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        const expectedSignature = Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        
        if (expectedSignature === razorpay_signature) {
            return Response.json({ success: true, verified: true });
        } else {
            return Response.json({ success: false, verified: false, error: 'Invalid signature' }, { status: 400 });
        }
        
    } catch (error) {
        console.error('Payment verification error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});