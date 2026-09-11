import { Resend } from 'resend';
import prisma from './prisma';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SENDER_EMAIL = 'Womens World <onboarding@resend.dev>'; // Needs verified domain in production

export async function sendOrderConfirmationEmail(orderId: string) {
  if (!resend) return;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true, variant: true }
        }
      }
    });

    if (!order || !order.email) return;

    const settings = await prisma.storeSettings.findUnique({ where: { id: 'global' } });
    const adminEmail = settings?.contactEmail || 'support@womensworld.com';

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #E8DCC4;">
          <strong style="color: #4A3B32; font-size: 15px;">${item.product.name}</strong><br/>
          <span style="color: #8B7355; font-size: 13px;">Size: ${item.variant?.size || 'Standard'}</span>
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #E8DCC4; text-align: center; color: #4A3B32;">${item.quantity}</td>
        <td style="padding: 16px; border-bottom: 1px solid #E8DCC4; text-align: right; color: #4A3B32; font-weight: bold;">₹${(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const payOnlineButton = order.paymentStatus === 'pending' 
      ? `<div style="text-align: center; margin: 30px 0;">
           <p style="color: #666; font-size: 14px; margin-bottom: 15px;">Change your mind? You can pay online now to avoid cash handling at delivery.</p>
           <a href="${baseUrl}/checkout/pay/${order.id}" style="background-color: #C5A46D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Pay Online Now</a>
         </div>`
      : '';

    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #FDFBF7; border: 1px solid #E8DCC4; border-radius: 12px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #121212; padding: 30px 20px; text-align: center;">
          <h1 style="color: #C5A46D; margin: 0; font-family: serif; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Women's World</h1>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #121212; margin-top: 0; font-size: 22px;">Order Confirmed! 🎉</h2>
          <p style="color: #4A3B32; font-size: 15px; line-height: 1.6;">Hi <strong>${order.customerName}</strong>,</p>
          <p style="color: #4A3B32; font-size: 15px; line-height: 1.6;">Thank you for shopping with Women's World! We're thrilled to have you. Your order has been successfully placed and we are currently preparing it for dispatch.</p>
          
          <!-- Timeline Card -->
          <div style="background-color: #F4F0E8; padding: 15px 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #C5A46D;">
            <p style="margin: 0; color: #4A3B32; font-size: 14px;"><strong>📦 What's Next?</strong><br/>You will receive another email as soon as your order ships. Estimated delivery is within <strong>3-7 business days</strong>.</p>
          </div>

          <!-- Order Details Card -->
          <div style="background-color: white; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #E8DCC4; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <h3 style="margin: 0 0 15px 0; color: #121212; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #E8DCC4; padding-bottom: 10px;">Order Summary (#${order.id.slice(-6).toUpperCase()})</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background-color: #FDFBF7;">
                <th style="padding: 12px 16px; text-align: left; border-bottom: 1px solid #E8DCC4; color: #8B7355; font-size: 12px; text-transform: uppercase;">Item</th>
                <th style="padding: 12px 16px; text-align: center; border-bottom: 1px solid #E8DCC4; color: #8B7355; font-size: 12px; text-transform: uppercase;">Qty</th>
                <th style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #E8DCC4; color: #8B7355; font-size: 12px; text-transform: uppercase;">Price</th>
              </tr>
              ${itemsHtml}
              <tr>
                <td colspan="2" style="padding: 16px; text-align: right; font-weight: bold; color: #4A3B32;">Total Amount</td>
                <td style="padding: 16px; text-align: right; font-weight: bold; color: #121212; font-size: 18px;">₹${order.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </table>

            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
              <div style="flex: 1; min-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: #8B7355; font-size: 12px; text-transform: uppercase;">Delivery To</h4>
                <p style="margin: 0; color: #4A3B32; font-size: 14px; line-height: 1.5;">${order.customerName}<br/>${order.address}<br/>Phone: ${order.phone}</p>
              </div>
              <div style="flex: 1; min-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: #8B7355; font-size: 12px; text-transform: uppercase;">Payment Method</h4>
                <p style="margin: 0; color: #4A3B32; font-size: 14px; line-height: 1.5; font-weight: bold;">
                  ${order.paymentStatus === 'paid' ? '✅ Paid Online (Razorpay)' : '💵 Cash on Delivery'}
                </p>
              </div>
            </div>
          </div>

          ${payOnlineButton}

          <!-- Support & Trust -->
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #E8DCC4;">
            <p style="color: #4A3B32; font-size: 14px; margin-bottom: 20px;">Need to change your address or ask a question?</p>
            <a href="https://wa.me/91${settings?.contactPhone?.replace(/\D/g, '') || '9999999999'}?text=Hi, I have a question about my order #${order.id.slice(-6).toUpperCase()}" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">Message us on WhatsApp</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #121212; padding: 20px; text-align: center; color: #6E6A64; font-size: 12px;">
          <p style="margin: 0 0 10px 0;">✨ 100% Authentic | Easy Returns | Secure Payments ✨</p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Women's World. All rights reserved.</p>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [order.email],
      // REMOVED BCC because in Resend Sandbox mode, if the admin email isn't verified, it blocks the ENTIRE email from sending to the customer!
      subject: `Order Confirmed: #${order.id.slice(-6).toUpperCase()} - Women's World`,
      html,
    });

    if (response.error) {
      console.error('[RESEND ERROR] Failed to send order confirmation:', response.error);
    } else {
      console.log(`[RESEND SUCCESS] Sent order confirmation to ${order.email}`);
    }

  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
}

export async function sendOrderStatusEmail(orderId: string, status: string) {
  if (!resend) return;

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true, variant: true }
        }
      }
    });

    if (!order || !order.email) return;

    let title = '';
    let message = '';

    switch (status) {
      case 'shipped':
        title = 'Your Order Has Shipped! 🚚';
        message = 'Great news! Your order has been dispatched and is on its way to you. Keep an eye out for the delivery agent.';
        break;
      case 'delivered':
        title = 'Your Order Has Been Delivered! 🎁';
        message = 'Your order has been successfully delivered. We hope you love your new items! If you have any issues, please let us know.';
        break;
      case 'cancelled':
        title = 'Order Cancelled';
        message = 'Your order has been cancelled. If you have already paid online, a refund will be initiated automatically to your original payment method.';
        break;
      case 'confirmed':
        title = 'Order Confirmed! 🎉';
        message = 'Your order has been confirmed by our team and is now being packed for shipment.';
        break;
      default:
        return; // Don't send emails for other statuses
    }

    const settings = await prisma.storeSettings.findUnique({ where: { id: 'global' } });

    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #E8DCC4;">
          <strong style="color: #4A3B32; font-size: 15px;">${item.product.name}</strong><br/>
          <span style="color: #8B7355; font-size: 13px;">Size: ${item.variant?.size || 'Standard'}</span>
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #E8DCC4; text-align: center; color: #4A3B32;">${item.quantity}</td>
        <td style="padding: 16px; border-bottom: 1px solid #E8DCC4; text-align: right; color: #4A3B32; font-weight: bold;">₹${(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #FDFBF7; border: 1px solid #E8DCC4; border-radius: 12px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #121212; padding: 30px 20px; text-align: center;">
          <h1 style="color: #C5A46D; margin: 0; font-family: serif; font-size: 28px; letter-spacing: 2px; text-transform: uppercase;">Women's World</h1>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #121212; margin-top: 0; font-size: 22px;">${title}</h2>
          <p style="color: #4A3B32; font-size: 15px; line-height: 1.6;">Hi <strong>${order.customerName}</strong>,</p>
          <p style="color: #4A3B32; font-size: 15px; line-height: 1.6;">${message}</p>
          
          <!-- Order Details Card -->
          <div style="background-color: white; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #E8DCC4; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
            <h3 style="margin: 0 0 15px 0; color: #121212; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #E8DCC4; padding-bottom: 10px;">Order Summary (#${order.id.slice(-6).toUpperCase()})</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background-color: #FDFBF7;">
                <th style="padding: 12px 16px; text-align: left; border-bottom: 1px solid #E8DCC4; color: #8B7355; font-size: 12px; text-transform: uppercase;">Item</th>
                <th style="padding: 12px 16px; text-align: center; border-bottom: 1px solid #E8DCC4; color: #8B7355; font-size: 12px; text-transform: uppercase;">Qty</th>
                <th style="padding: 12px 16px; text-align: right; border-bottom: 1px solid #E8DCC4; color: #8B7355; font-size: 12px; text-transform: uppercase;">Price</th>
              </tr>
              ${itemsHtml}
              <tr>
                <td colspan="2" style="padding: 16px; text-align: right; font-weight: bold; color: #4A3B32;">Total Amount</td>
                <td style="padding: 16px; text-align: right; font-weight: bold; color: #121212; font-size: 18px;">₹${order.totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </table>

            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
              <div style="flex: 1; min-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: #8B7355; font-size: 12px; text-transform: uppercase;">Delivery To</h4>
                <p style="margin: 0; color: #4A3B32; font-size: 14px; line-height: 1.5;">${order.customerName}<br/>${order.address}<br/>Phone: ${order.phone}</p>
              </div>
              <div style="flex: 1; min-width: 200px;">
                <h4 style="margin: 0 0 5px 0; color: #8B7355; font-size: 12px; text-transform: uppercase;">Payment Method</h4>
                <p style="margin: 0; color: #4A3B32; font-size: 14px; line-height: 1.5; font-weight: bold;">
                  ${order.paymentStatus === 'paid' ? '✅ Paid Online (Razorpay)' : '💵 Cash on Delivery'}
                </p>
              </div>
            </div>
          </div>

          <!-- Support & Trust -->
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #E8DCC4;">
            <p style="color: #4A3B32; font-size: 14px; margin-bottom: 20px;">Need to talk to us about this order?</p>
            <a href="https://wa.me/91${settings?.contactPhone?.replace(/\D/g, '') || '9999999999'}?text=Hi, I have a question about my order #${order.id.slice(-6).toUpperCase()}" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">Message us on WhatsApp</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #121212; padding: 20px; text-align: center; color: #6E6A64; font-size: 12px;">
          <p style="margin: 0 0 10px 0;">✨ 100% Authentic | Easy Returns | Secure Payments ✨</p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Women's World. All rights reserved.</p>
        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [order.email],
      subject: `Update on Order #${order.id.slice(-6).toUpperCase()}: ${title}`,
      html,
    });

    if (response.error) {
      console.error('[RESEND ERROR] Failed to send order status email:', response.error);
    } else {
      console.log(`[RESEND SUCCESS] Sent order status update to ${order.email}`);
    }

  } catch (error) {
    console.error('Failed to send order status email:', error);
  }
}
