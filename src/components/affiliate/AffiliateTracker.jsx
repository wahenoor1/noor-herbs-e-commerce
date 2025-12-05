import { useEffect } from 'react';
import { base44 } from "@/api/base44Client";

// This component tracks affiliate visits and sets cookies
export default function AffiliateTracker() {
  useEffect(() => {
    const trackAffiliateVisit = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const affId = urlParams.get('aff_id') || urlParams.get('ref');
      
      if (affId) {
        // Set affiliate cookie (30 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        document.cookie = `noorherbs_aff_id=${affId}; expires=${expiryDate.toUTCString()}; path=/`;
        
        // Generate session ID if not exists
        let sessionId = localStorage.getItem('noorherbs_session_id');
        if (!sessionId) {
          sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('noorherbs_session_id', sessionId);
        }
        
        // Record click
        try {
          await base44.entities.AffiliateClick.create({
            affiliate_id: affId,
            page_url: window.location.href,
            referrer: document.referrer || '',
            user_agent: navigator.userAgent,
            session_id: sessionId
          });
          
          // Update affiliate click count
          const affiliates = await base44.entities.Affiliate.filter({ affiliate_id: affId });
          if (affiliates.length > 0) {
            const affiliate = affiliates[0];
            await base44.entities.Affiliate.update(affiliate.id, {
              total_clicks: (affiliate.total_clicks || 0) + 1
            });
          }
        } catch (error) {
          console.log('Affiliate tracking error:', error);
        }
      }
    };
    
    trackAffiliateVisit();
  }, []);
  
  return null; // This is a tracking component, no UI
}

// Utility function to get affiliate ID from cookie
export function getAffiliateFromCookie() {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'noorherbs_aff_id') {
      return value;
    }
  }
  return null;
}

// Utility function to validate coupon and get affiliate
export async function getAffiliateFromCoupon(couponCode) {
  if (!couponCode) return null;
  try {
    const affiliates = await base44.entities.Affiliate.filter({ 
      coupon_code: couponCode.toUpperCase(),
      status: 'approved'
    });
    return affiliates.length > 0 ? affiliates[0] : null;
  } catch (error) {
    return null;
  }
}

// Calculate commission
export function calculateCommission(affiliate, orderTotal) {
  if (!affiliate) return 0;
  if (affiliate.commission_type === 'fixed') {
    return affiliate.commission_value || 0;
  }
  return (orderTotal * (affiliate.commission_value || 10)) / 100;
}