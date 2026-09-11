import prisma from '@/lib/prisma';
import Link from 'next/link';
import { toggleProductStatus } from '@/app/actions/product';
import OrderStatusDropdown from '@/components/OrderStatusDropdown';

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-[#4A3B32]">Orders</h1>
          <p className="text-sm text-[#8B7355] mt-1">Manage and track customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E8DCC4] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E8DCC4]">
            <thead className="bg-[#FDFBF7]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E8DCC4]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-medium text-[#4A3B32] hover:text-[#8B9D83] transition-colors"
                    >
                      #{order.id.slice(-6).toUpperCase()}
                    </Link>
                    <div className="text-xs text-[#8B7355]">{order.items.length} item(s)</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#4A3B32]">{order.customerName}</div>
                    <div className="text-xs text-[#8B7355]">{order.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusDropdown orderId={order.id} currentStatus={order.orderStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                      order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#4A3B32]">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-[#8B7355]">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
              
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8B7355]">
                    No orders found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
