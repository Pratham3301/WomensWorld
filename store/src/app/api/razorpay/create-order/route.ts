import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import prisma from '@/lib/prisma';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customerName, phone, address, items } = body;

    if (!amount || !customerName || !phone || !address || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ─── Step 1: Verify stock for all variants inside a transaction ───────────
    const order = await prisma.$transaction(async (tx) => {
      // Check stock for every item in the cart that has a variantId
      for (const item of items) {
        if (item.variantId) {
          const variant = await tx.variant.findUnique({
            where: { id: item.variantId },
            select: { stock: true, size: true, product: { select: { name: true } } },
          });

          if (!variant) {
            throw new Error(`Variant not found for product: ${item.name}`);
          }
          if (variant.stock < item.quantity) {
            throw new Error(
              `Sorry, only ${variant.stock} unit(s) of "${item.name}" (Size: ${variant.size ?? 'N/A'}) are left in stock.`
            );
          }
        }
      }

      // ─── Step 2: Create order in DB as 'pending' ─────────────────────────
      const newOrder = await tx.order.create({
        data: {
          customerName,
          phone,
          address,
          totalAmount: amount / 100, // paise → rupees
          paymentStatus: 'pending',
          orderStatus: 'placed',
          items: {
            create: items.map((item: {
              productId: string;
              variantId?: string;
              quantity: number;
              price: number;
            }) => ({
              productId: item.productId,
              variantId: item.variantId ?? null,
              quantity: item.quantity,
              priceAtPurchase: item.price,
            })),
          },
        },
      });

      return newOrder;
    });

    // ─── Step 3: Create Razorpay order (outside transaction — external API) ──
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `rcpt_${order.id.slice(-12)}`,
    });

    // ─── Step 4: Persist Razorpay order ID back to our DB ────────────────────
    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return NextResponse.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      dbOrderId: order.id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create order';
    // Stock errors are user-facing (4xx), server errors are 500
    const isUserError = message.startsWith('Sorry,') || message.includes('not found');
    console.error('[create-order]', message);
    return NextResponse.json({ error: message }, { status: isUserError ? 422 : 500 });
  }
}
