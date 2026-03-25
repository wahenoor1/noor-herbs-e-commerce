import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { to, name, affiliate_id, coupon_code } = await req.json();

        const body = `Dear ${name},

Congratulations! Your affiliate account with Noor Herbs has been approved.

Your Affiliate ID: ${affiliate_id}
${coupon_code ? `Your Coupon Code: ${coupon_code}` : ''}

You can now login to your affiliate dashboard and start earning commissions by promoting our products.

Best regards,
Noor Herbs Team`;

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Noor Herbs <onboarding@resend.dev>',
                to: [to],
                subject: 'Affiliate Account Approved - Noor Herbs',
                text: body
            })
        });

        const data = await res.json();
        return Response.json({ success: true, data });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});