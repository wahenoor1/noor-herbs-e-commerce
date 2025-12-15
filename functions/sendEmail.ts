import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { to, subject, body, from_name } = await req.json();
        
        if (!to || !subject || !body) {
            return Response.json({ error: 'Missing required fields: to, subject, body' }, { status: 400 });
        }
        
        const resendApiKey = Deno.env.get("RESEND_API_KEY");
        if (!resendApiKey) {
            return Response.json({ error: 'Resend API key not configured' }, { status: 500 });
        }
        
        // Send email via Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: from_name ? `${from_name} <onboarding@resend.dev>` : 'Noor Herbs <onboarding@resend.dev>',
                to: [to],
                subject: subject,
                text: body
            })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            console.error('Resend API error:', result);
            return Response.json({ error: 'Failed to send email', details: result }, { status: response.status });
        }
        
        return Response.json({ success: true, id: result.id });
        
    } catch (error) {
        console.error('Email sending error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});