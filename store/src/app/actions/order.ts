"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendOrderConfirmationEmail } from "@/lib/email";


export async function createOrder(data: {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  deliveryMethod: "ship" | "pickup";
  customerId?: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    size?: string;
    variantId?: string;
  }[];
  paymentStatus?: "pending" | "paid";
  razorpayOrderId?: string;
}) {
  try {
    const order = await prisma.$transaction(async (tx) => {
      // 1. Verify prices from DB (never trust client prices) and check/deduct stock
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of data.items) {
        const dbProduct = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });
        if (!dbProduct) throw new Error(`Product not found: ${item.productId}`);

        const priceToCharge = dbProduct.discountPrice ?? dbProduct.price;
        totalAmount += priceToCharge * item.quantity;

        // Find variant if a size was chosen
        let variantId: string | null = null;
        if (item.variantId) {
          variantId = item.variantId;
        } else if (item.size) {
          const v = dbProduct.variants.find((v) => v.size === item.size);
          if (v) variantId = v.id;
        }

        // Stock check + deduction (for COD orders; online orders are handled by webhook)
        if (variantId) {
          const variant = await tx.variant.findUnique({ where: { id: variantId } });
          if (!variant) throw new Error(`Size variant not found for "${dbProduct.name}"`);
          if (variant.stock < item.quantity) {
            throw new Error(
              `Sorry, only ${variant.stock} unit(s) of "${dbProduct.name}" (Size: ${variant.size ?? 'N/A'}) are left in stock.`
            );
          }
          // Deduct stock immediately for COD (online deduction happens via webhook)
          if (!data.razorpayOrderId) {
            await tx.variant.update({
              where: { id: variantId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }

        orderItemsData.push({
          productId: item.productId,
          variantId,
          quantity: item.quantity,
          priceAtPurchase: priceToCharge,
        });
      }

      // 2. Add shipping
      const shipping = data.deliveryMethod === "pickup" ? 0 : totalAmount >= 499 ? 0 : 49;
      totalAmount += shipping;

      // 3. Create order record
      return tx.order.create({
        data: {
          customerName: data.customerName,
          email: data.email ?? null,
          phone: data.phone,
          address: data.deliveryMethod === "pickup" ? "Pickup In-Store" : data.address,
          totalAmount,
          paymentStatus: data.paymentStatus ?? "pending",
          orderStatus: "placed",
          razorpayOrderId: data.razorpayOrderId ?? null,
          customerId: data.customerId ?? null,
          items: { create: orderItemsData },
        },
      });
    });

    // Send confirmation email
    await sendOrderConfirmationEmail(order.id);

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Order creation failed:", error);
    
    // Sanitize database errors so they don't leak to the frontend
    let errorMessage = "Failed to create order. Please try again.";
    if (error instanceof Error && !error.message.includes("prisma")) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
}

export async function createRazorpayOrder(amount: number) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return { success: false, error: "Online payments are not configured yet. Please choose Cash on Delivery." };
  }

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      },
      body: JSON.stringify({ amount: Math.round(amount * 100), currency: "INR", receipt: `ww_${Date.now()}` }),
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Unable to start online payment");
    const order = await response.json();
    return { success: true, keyId, orderId: order.id, amount: order.amount, currency: order.currency };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : "Unable to start online payment" };
  }
}

export async function verifyRazorpayPayment(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  orderId?: string; // Optional DB Order ID to mark as paid
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return { success: false, error: "Payment verification is not configured" };

  const crypto = await import("crypto");
  const expected = crypto.createHmac("sha256", secret)
    .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
    .digest("hex");

  const isValid = expected === data.razorpaySignature;

  if (isValid && data.orderId) {
    try {
      await prisma.order.update({
        where: { id: data.orderId },
        data: { 
          paymentStatus: "paid", 
          razorpayOrderId: data.razorpayOrderId 
        },
      });
      // Optionally revalidate or trigger another email here
      revalidatePath("/admin/orders");
    } catch (error) {
      console.error("Failed to update order payment status:", error);
    }
  }

  return isValid
    ? { success: true }
    : { success: false, error: "Payment verification failed" };
}
