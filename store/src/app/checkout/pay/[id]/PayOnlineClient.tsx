"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { verifyRazorpayPayment, createRazorpayOrder } from "@/app/actions/order";

export default function PayOnlineClient({ 
  orderId, 
  amount,
  customerName,
  email,
  phone
}: { 
  orderId: string, 
  amount: number,
  customerName: string,
  email: string,
  phone: string
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Create Razorpay order first using the server action
      const data = await createRazorpayOrder(amount);
      
      if (!data.success) throw new Error(data.error || "Failed to create Razorpay order");

      const options = {
        key: data.keyId, // Use the keyId returned from the server securely
        amount: Math.round(amount * 100),
        currency: "INR",
        name: "Women's World",
        description: `Payment for Order #${orderId.slice(-6).toUpperCase()}`,
        order_id: data.orderId,
        handler: async function (response: any) {
          // Verify payment
          const verifyRes = await verifyRazorpayPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: orderId, // We pass the DB order ID so it knows what to update!
          });

          if (verifyRes.success) {
            alert("Payment Successful! Thank you.");
            router.push(`/checkout/success?orderId=${orderId}`);
          } else {
            alert("Payment verification failed.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerName,
          email: email,
          contact: phone,
        },
        theme: {
          color: "#4A3B32",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', function () {
        alert("Payment failed or cancelled.");
        setIsProcessing(false);
      });
      rzp1.open();
      
    } catch (error) {
      alert("Error initiating payment.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="flex justify-center">
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full max-w-sm bg-[#4A3B32] text-white py-4 px-8 rounded-full font-bold text-lg hover:bg-[#3A2E27] transition disabled:opacity-70 flex items-center justify-center shadow-lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            `Pay ₹${amount.toLocaleString('en-IN')} via Razorpay`
          )}
        </button>
      </div>
    </>
  );
}
