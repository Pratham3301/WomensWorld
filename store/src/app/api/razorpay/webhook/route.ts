import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret_placeholder';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle payment.captured
    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      // Find order
      const order = await prisma.order.findFirst({
        where: { razorpayOrderId: razorpayOrderId },
        include: { items: true }
      });

      if (order && order.paymentStatus === 'pending') {
        // Update payment status
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'paid', orderStatus: 'confirmed' }
        });

        // Deduct stock for each item
        for (const item of order.items) {
          if (item.variantId) {
            await prisma.variant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } }
            });
          }
        }
      }
    }

    // Handle payment.failed
    if (event.event === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      await prisma.order.updateMany({
        where: { razorpayOrderId: razorpayOrderId },
        data: { paymentStatus: 'failed' }
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
