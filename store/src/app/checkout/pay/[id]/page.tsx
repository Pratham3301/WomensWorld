import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PayOnlineClient from "./PayOnlineClient";

export default async function PayOnlinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true, variant: true } },
    }
  });

  if (!order) return notFound();

  // If already paid, don't allow paying again
  if (order.paymentStatus === 'paid') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Already Paid! ✅</h1>
          <p>This order has already been paid for online. Thank you!</p>
        </div>
      </div>
    );
  }

  // Calculate items for razorpay
  const items = order.items.map(i => ({
    id: i.productId,
    name: i.product.name,
    price: i.priceAtPurchase,
    quantity: i.quantity
  }));

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Complete Your Payment</h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8DCC4] mb-8">
        <h2 className="text-lg font-bold text-gray-900 border-b border-[#E8DCC4] pb-4 mb-4">
          Order Summary (#{order.id.slice(-6).toUpperCase()})
        </h2>
        
        <div className="space-y-4 mb-6">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-gray-500">Qty: {item.quantity} | Size: {item.variant?.size || 'Standard'}</p>
              </div>
              <p className="font-medium">₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
        
        <div className="border-t border-[#E8DCC4] pt-4 flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Amount</span>
          <span className="text-xl font-bold text-[#4A3B32]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <PayOnlineClient 
        orderId={order.id} 
        amount={order.totalAmount} 
        customerName={order.customerName}
        email={order.email || ""}
        phone={order.phone}
      />
    </div>
  );
}
