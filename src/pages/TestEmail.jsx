import React, { useState } from 'react';
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function TestEmail() {
  const [email, setEmail] = useState('wahenoorenterprises@gmail.com');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendTestEmail = async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    setIsSending(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: email,
        subject: "Test Email from Noor Herbs - " + new Date().toLocaleString(),
        body: `Hello!\n\nThis is a test email from Noor Herbs website.\n\nIf you received this email, it means the email system is working correctly.\n\nTime sent: ${new Date().toLocaleString()}\n\nBest regards,\nNoor Herbs Team`
      });
      toast.success("Test email sent successfully!");
      setSent(true);
    } catch (error) {
      console.error("Email error:", error);
      toast.error("Failed to send email: " + (error.message || "Unknown error"));
    }
    setIsSending(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" /> Test Email System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-2">Email Sent!</h3>
              <p className="text-gray-600 mb-4">Check your inbox at {email}</p>
              <Button variant="outline" onClick={() => setSent(false)}>Send Another</Button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Send test email to:</label>
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <Button 
                onClick={sendTestEmail} 
                disabled={isSending}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Test Email
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}