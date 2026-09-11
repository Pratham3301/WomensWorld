import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Phone, MapPin, Package, CreditCard, MessageCircle } from 'lucide-react';
import OrderStatusDropdown from '@/components/OrderStatusDropdown';

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  paid:      'bg-green-100  text-green-800  border-green-200',
  failed:    'bg-red-100    text-red-800    border-red-200',
  placed:    'bg-blue-100   text-blue-800   border-blue-200',
  confirmed: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  shipped:   'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100  text-green-800  border-green-200',
  cancelled: 'bg-gray-100   text-gray-600   border-gray-200',
};

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { include: { images: true } },
          variant: true,
        },
      },
      customer: true,
    },
  });

  if (!order) notFound();

  const whatsappMessage = encodeURIComponent(
    `Hi ${order.customerName}! 🛍️\n\nYour Women's World order #${order.id.slice(-6).toUpperCase()} has been *confirmed*.\n\nItems: ${order.items.map(i => `${i.product.name} (${i.variant?.size ?? 'N/A'}) × ${i.quantity}`).join(', ')}\n\nTotal: ₹${order.totalAmount.toLocaleString('en-IN')}\n\nThank you for shopping with us! 🌸`
  );
  const whatsappUrl = `https://wa.me/91${order.phone.replace(/\D/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="p-2 rounded-lg border border-[#E8DCC4] hover:bg-[#FDFBF7] text-[#4A3B32] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-[#4A3B32]">
              Order #{order.id.slice(-6).toUpperCase()}
            </h1>
            <p className="text-sm text-[#8B7355] mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm font-medium rounded-lg hover:bg-[#1fba59] transition-colors shadow-sm"
        >
          <MessageCircle className="h-4 w-4 fill-white" />
          WhatsApp Customer
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── Order Items ── */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[#E8DCC4] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E8DCC4] flex items-center gap-2">
              <Package className="h-4 w-4 text-[#8B7355]" />
              <h2 className="font-medium text-[#4A3B32]">Items ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-[#E8DCC4]">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#F4F0E8] border border-[#E8DCC4]">
                    {item.product.images[0]?.url ? (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-[#8B7355]">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-[#4A3B32] truncate">{item.product.name}</p>
                    <p className="text-xs text-[#8B7355] mt-0.5">
                      Size: {item.variant?.size ?? 'N/A'} · Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-[#4A3B32]">
                      ₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-[#8B7355]">₹{item.priceAtPurchase.toLocaleString('en-IN')} each</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Order total */}
            <div className="px-6 py-4 bg-[#FDFBF7] border-t border-[#E8DCC4] flex justify-between items-center">
              <span className="text-sm font-medium text-[#4A3B32]">Order Total</span>
              <span className="text-lg font-bold text-[#4A3B32]">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-xl border border-[#E8DCC4] shadow-sm p-5 space-y-4">
            <h2 className="font-medium text-[#4A3B32]">Status</h2>

            <div>
              <p className="text-xs font-medium text-[#8B7355] uppercase tracking-wide mb-1.5">Order Status</p>
              <OrderStatusDropdown orderId={order.id} currentStatus={order.orderStatus} />
            </div>

            <div>
              <p className="text-xs font-medium text-[#8B7355] uppercase tracking-wide mb-1.5">Payment</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[order.paymentStatus] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                <CreditCard className="h-3 w-3 mr-1.5" />
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>

            {order.razorpayOrderId && (
              <div>
                <p className="text-xs font-medium text-[#8B7355] uppercase tracking-wide mb-1">Razorpay ID</p>
                <p className="text-xs font-mono text-[#4A3B32] break-all">{order.razorpayOrderId}</p>
              </div>
            )}
          </div>

          {/* Customer */}
          <div className="bg-white rounded-xl border border-[#E8DCC4] shadow-sm p-5 space-y-3">
            <h2 className="font-medium text-[#4A3B32]">Customer</h2>
            <p className="text-sm font-semibold text-[#4A3B32]">{order.customerName}</p>

            <a
              href={`tel:${order.phone}`}
              className="flex items-center gap-2 text-sm text-[#8B7355] hover:text-[#4A3B32] transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              {order.phone}
            </a>

            <div className="flex items-start gap-2 text-sm text-[#8B7355]">
              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{order.address}</span>
            </div>

            {order.customer && (
              <Link
                href={`/admin/customers`}
                className="text-xs text-[#8B9D83] underline underline-offset-2"
              >
                View customer account →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
