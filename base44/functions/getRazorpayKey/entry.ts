import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const keyId = Deno.env.get("RAZORPAY_KEY_ID");
        
        if (!keyId) {
            return Response.json({ error: 'Razorpay key not configured' }, { status: 500 });
        }
        
        return Response.json({ key: keyId });
        
    } catch (error) {
        console.error('Error fetching Razorpay key:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});