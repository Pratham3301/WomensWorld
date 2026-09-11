"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, ShieldCheck, CreditCard, Banknote, MessageCircle } from "lucide-react";
import Script from "next/script";
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions/order";
import { getCheckoutCustomerData, requestCodOtp, verifyCodOtp } from "@/app/actions/checkoutActions";
import { WHATSAPP_PHONE } from "@/components/WhatsAppWidget";

type InputFieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputField = ({
  label,
  name,
  type = "text",
  required = true,
  className = "",
  placeholder = "",
  value,
  onChange,
}: InputFieldProps) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-xs font-sans font-semibold tracking-wider uppercase text-[#121212]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      placeholder={placeholder || `Enter ${label.toLowerCase()}`}
      value={value}
      onChange={onChange}
      className="w-full bg-white border border-[#E8E4DC] rounded-lg px-3.5 py-2.5 text-sm font-sans text-[#121212] placeholder:text-[#6E6A64]/50 focus:outline-none focus:border-[#121212] transition-colors"
    />
  </div>
);

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"ship" | "pickup">("ship");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [codStep, setCodStep] = useState<"details" | "otp">("details");
  const [otpValue, setOtpValue] = useState("");

  const [customer, setCustomer] = useState<any>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleAddressSelect = (addr: any) => {
    setSelectedAddressId(addr.id);
    setForm(f => ({
      ...f,
      address: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    }));
  };

  useEffect(() => {
    setMounted(true);
    async function loadCustomer() {
      const data = await getCheckoutCustomerData();
      if (data) {
        setCustomer(data);
        setForm(f => ({
          ...f,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || "",
        }));
        if (data.addresses && data.addresses.length > 0) {
          const defaultAddress = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
          handleAddressSelect(defaultAddress);
        }
      }
    }
    loadCustomer();
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0 && !isSuccess) {
      router.push("/cart");
    }
  }, [mounted, items.length, isSuccess, router]);

  if (!mounted || (items.length === 0 && !isSuccess)) return null;

  const handle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));



  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shipping = deliveryMethod === "pickup" || subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  const finishOrder = async (paymentStatus: "pending" | "paid", razorpayOrderId?: string) => {
    setIsSubmitting(true);
    setError(null);

    const fullAddress =
      deliveryMethod === "pickup"
        ? "Store Pickup at Women's World, Nashik"
        : `${form.address}, ${form.city}, ${form.state} - ${form.pincode}`;
    const customerName = `${form.firstName} ${form.lastName}`;

    const res = await createOrder({
      customerName,
      phone: form.phone,
      email: form.email,
      address: fullAddress,
      deliveryMethod,
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
        size: i.size,
      })),
      paymentStatus,
      razorpayOrderId,
      customerId: customer?.id,
    });

    setIsSubmitting(false);

    if (res.success) {
      setOrderId(res.orderId as string);
      setIsSuccess(true);
      clearCart();
    } else {
      setError(res.error || "Something went wrong.");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Front-end Validations
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    if (deliveryMethod === "ship") {
      const pinRegex = /^[0-9]{6}$/;
      if (!pinRegex.test(form.pincode)) {
        setError("Please enter a valid 6-digit postal code.");
        return;
      }
    }

    if (paymentMethod === "cod") {
      if (total > 3000) {
        setError("Orders above ₹3,000 must be paid online via Razorpay.");
        return;
      }
      setIsSubmitting(true);
      setError(null);
      const res = await requestCodOtp(form.email, total);
      setIsSubmitting(false);

      if (res.error) {
        setError(res.error);
      } else {
        setCodStep("otp");
      }
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const payment = await createRazorpayOrder(total);
    if (!payment.success) {
      setIsSubmitting(false);
      setError(payment.error || "Online payment is unavailable");
      return;
    }

    const RazorpayConstructor = (
      window as unknown as { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } }
    ).Razorpay;
    if (!RazorpayConstructor) {
      setIsSubmitting(false);
      setError("Payment window is still loading. Please try again.");
      return;
    }
    const razorpay = new RazorpayConstructor({
      key: payment.keyId,
      amount: payment.amount,
      currency: payment.currency,
      name: "Women's World",
      description: "Your Order",
      order_id: payment.orderId,
      prefill: {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        contact: form.phone,
      },
      theme: { color: "#121212" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verified = await verifyRazorpayPayment({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
        if (verified.success) {
          await finishOrder("paid", response.razorpay_order_id);
        } else {
          setIsSubmitting(false);
          setError(verified.error || "Payment verification failed.");
        }
      },
      modal: {
        ondismiss: () => {
          setIsSubmitting(false);
        },
      },
    });
    razorpay.open();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const res = await verifyCodOtp(form.email, otpValue);
    if (!res.isValid) {
      setIsSubmitting(false);
      setError(res.error || "Invalid OTP");
      return;
    }

    // OTP valid!
    await finishOrder("pending");
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-[#FAF9F6]">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#E8E4DC] text-center max-w-lg w-full">
          <div className="w-14 h-14 bg-[#F4F0E8] rounded-full flex items-center justify-center mx-auto mb-5 text-[#121212]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-sans font-semibold tracking-widest text-[#6E6A64] uppercase block mb-1">
            Order Confirmed
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-[#121212] uppercase tracking-wide mb-2">
            Thank You
          </h1>
          <p className="text-sm font-sans text-[#6E6A64] mb-4">
            Reference: <strong className="text-[#121212] font-mono">{orderId}</strong>
          </p>
          <p className="text-sm text-[#6E6A64] mb-8 font-light">
            Our team in Nashik is preparing your order for dispatch.
          </p>

          <div className="space-y-2.5">
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(`Hi! I just placed order ${orderId} on your website. Please share dispatch updates.`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg font-sans font-semibold text-sm uppercase tracking-wider transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" /> Track on WhatsApp
            </a>

            <Link
              href="/"
              className="block w-full py-3 bg-[#FAF9F6] text-[#121212] hover:bg-[#121212] hover:text-white rounded-lg font-sans font-semibold text-xs uppercase tracking-wider border border-[#E8E4DC] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="bg-[#FAF9F6] min-h-screen pt-4 pb-24">
        <div className="mx-auto px-4 sm:px-6 lg:px-12 max-w-[1440px] w-full">
          <div className="mb-6">
            <h1 className="font-display text-3xl sm:text-4xl text-[#121212] uppercase tracking-wide">
              Checkout
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Form */}
            <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E4DC]">
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div>
                  <h2 className="font-sans text-sm font-bold tracking-wider uppercase text-[#121212] mb-3 pb-2 border-b border-[#E8E4DC]">
                    1. Contact
                  </h2>

                  {/* Saved Addresses (if logged in) */}
                  {customer && customer.addresses && customer.addresses.length > 0 && deliveryMethod === "ship" && (
                    <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E4DC] mb-6">
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-[#121212] mb-3">
                        Select Saved Address
                      </label>
                      <div className="space-y-2">
                        {customer.addresses.map((addr: any) => (
                          <label key={addr.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-[#C5A46D] bg-white' : 'border-[#E8E4DC] bg-white hover:border-[#C5A46D]/50'}`}>
                            <input type="radio" name="savedAddress" checked={selectedAddressId === addr.id} onChange={() => handleAddressSelect(addr)} className="mt-1 accent-[#C5A46D]" />
                            <div>
                              <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#121212] block mb-0.5">{addr.label}</span>
                              <span className="text-sm font-sans text-[#6E6A64] font-light block">{addr.street}, {addr.city}</span>
                              <span className="text-xs font-sans text-[#6E6A64] font-light block">{addr.state} {addr.pincode}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="First Name" name="firstName" value={form.firstName} onChange={handle} />
                    <InputField label="Last Name" name="lastName" value={form.lastName} onChange={handle} />
                    <InputField label="Phone" name="phone" type="tel" value={form.phone} onChange={handle} placeholder="10-digit mobile" />
                    <InputField label="Email" name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" />
                  </div>
                </div>

                <div>
                  <h2 className="font-sans text-xs font-bold tracking-wider uppercase text-[#121212] mb-3 pb-2 border-b border-[#E8E4DC]">
                    2. Delivery Address
                  </h2>
                  <div className="space-y-3">
                    <InputField label="Street Address" name="address" value={form.address} onChange={handle} placeholder="House, Street, Landmark" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <InputField label="City" name="city" value={form.city} onChange={handle} />
                      <InputField label="State" name="state" value={form.state} onChange={handle} />
                      <InputField label="PIN Code" name="pincode" value={form.pincode} onChange={handle} />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-sans text-sm font-bold tracking-wider uppercase text-[#121212] mb-3 pb-2 border-b border-[#E8E4DC]">
                    3. Payment
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "cod"
                          ? "border-[#121212] bg-[#FAF9F6]"
                          : "border-[#E8E4DC] bg-white"
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mt-0.5 accent-[#121212] w-4 h-4"
                      />
                      <Banknote className="h-4 w-4 text-[#6E6A64] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-sans font-bold text-xs text-[#121212]">Cash on Delivery</p>
                        <p className="text-xs text-[#6E6A64] mt-0.5">Pay when your order arrives.</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === "online"
                          ? "border-[#121212] bg-[#FAF9F6]"
                          : "border-[#E8E4DC] bg-white"
                        }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                        className="mt-0.5 accent-[#121212] w-4 h-4"
                      />
                      <CreditCard className="h-4 w-4 text-[#6E6A64] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-sans font-bold text-xs text-[#121212]">Online Payment</p>
                        <p className="text-xs text-[#6E6A64] mt-0.5">UPI, Cards &amp; NetBanking.</p>
                      </div>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-100">
                    {error}
                  </div>
                )}

                {codStep === "details" ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#121212] hover:bg-[#2A2825] text-white rounded-lg font-sans font-semibold text-sm uppercase tracking-[0.14em] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                      </>
                    ) : paymentMethod === "online" ? (
                      `Pay ₹${total.toLocaleString("en-IN")}`
                    ) : (
                      `Place Order ₹${total.toLocaleString("en-IN")}`
                    )}
                  </button>
                ) : (
                  <div className="bg-[#FAF9F6] p-5 rounded-xl border border-[#E8E4DC] space-y-4">
                    <div>
                      <h3 className="font-sans font-bold text-sm text-[#121212] mb-1">Verify Your Email</h3>
                      <p className="text-xs text-[#6E6A64]">
                        Please enter the 6-digit code sent to <span className="font-semibold text-[#121212]">{form.email}</span> to confirm your COD order.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="000000"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        maxLength={6}
                        className="w-full text-center tracking-[0.5em] font-mono font-bold bg-white border border-[#E8E4DC] rounded-lg px-4 py-3 text-lg text-[#121212] focus:outline-none focus:border-[#121212] transition-colors"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCodStep("details")}
                          className="flex-1 py-3 bg-white border border-[#E8E4DC] text-[#121212] rounded-lg font-sans font-semibold text-xs uppercase tracking-wider hover:bg-[#F4F0E8] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isSubmitting || otpValue.length < 6}
                          className="flex-[2] py-3 bg-[#121212] text-white rounded-lg font-sans font-semibold text-xs uppercase tracking-wider hover:bg-[#2A2825] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Confirm"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Summary */}
            <div className="w-full lg:w-[380px]">
              <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] sticky top-28 space-y-4">
                <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-[#121212] pb-3 border-b border-[#E8E4DC]">
                  Your Order ({items.length})
                </h2>

                <div className="space-y-2.5 max-h-[250px] overflow-y-auto no-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-2 bg-[#FAF9F6] rounded-lg">
                      <div className="relative h-14 w-12 bg-[#F4F0E8] rounded-md overflow-hidden flex-shrink-0">
                        {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="font-sans font-semibold text-xs text-[#121212] line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-[#6E6A64]">Size: {item.size ?? "Standard"} &bull; Qty: {item.quantity}</p>
                        <p className="text-xs font-bold text-[#121212]">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm text-[#6E6A64] border-t border-[#E8E4DC] pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#121212]">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    {shipping === 0 ? <span className="font-semibold text-[#1B4D3E]">FREE</span> : <span className="font-bold text-[#121212]">₹{shipping}</span>}
                  </div>
                </div>

                <div className="border-t border-[#E8E4DC] pt-3 flex justify-between items-baseline">
                  <span className="font-sans font-bold text-sm uppercase tracking-wider text-[#121212]">Total</span>
                  <span className="font-sans text-xl font-bold text-[#121212]">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
