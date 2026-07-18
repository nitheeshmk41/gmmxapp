"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RazorpayCheckout({
  planName,
  price,
  period,
  gymId,
  highlighted,
  className
}: {
  planName: string;
  price: number;
  period: string;
  gymId: string;
  highlighted: boolean;
  className?: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsPending(true);

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsPending(false);
      return;
    }

    try {
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planName, amount: price, period, gymId }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use test key from env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "GMMX Subscriptions",
        description: `${planName} Subscription`,
        order_id: orderData.id,
        handler: async function (response: any) {
          toast.loading("Verifying payment...", { id: "verify-toast" });
          
          try {
            const verifyRes = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                gymId,
                plan: planName,
                period
              }),
            });

            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              toast.success("Payment successful! Your plan is now active.", { id: "verify-toast" });
              router.push("/owner/dashboard/settings/billing");
              router.refresh();
            } else {
              toast.error(verifyData.error || "Payment verification failed", { id: "verify-toast" });
            }
          } catch (error) {
            toast.error("Network error during verification. Please contact support.", { id: "verify-toast" });
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#FF5C73",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();

    } catch (error: any) {
      toast.error(error.message || "An error occurred during checkout");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isPending}
      className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-bold transition-colors ${className}`}
      style={{
        background: highlighted ? "#FF5C73" : "white",
        color: highlighted ? "white" : "#0F172A",
        border: highlighted ? "1px solid #FF5C73" : "1px solid #CBD5E1",
      }}
    >
      {isPending ? <Loader2 size={16} className="animate-spin" /> : "Buy Now"}
    </button>
  );
}
