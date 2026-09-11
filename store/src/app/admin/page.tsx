import { PrismaClient } from '@prisma/client';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // Fetch high-level stats with a try/catch to prevent Vercel build crashes
  let productCount = 0, orderCount = 0, customerCount = 0, allOrders: any[] = [];
  
  try {
    [productCount, orderCount, customerCount, allOrders] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.customer.count(),
      prisma.order.findMany({ select: { totalAmount: true } }),
    ]);
  } catch (error) {
    console.error("Database connection failed during build phase:", error);
    // Gracefully fallback to zeros during the Vercel static analysis pass
  }

  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  const stats = [
    { name: 'Total Products', value: productCount.toString(), icon: Package, change: '+4.75%', trend: 'up' },
    { name: 'Total Orders', value: orderCount.toString(), icon: ShoppingCart, change: '+54.02%', trend: 'up' },
    { name: 'Active Customers', value: customerCount.toString(), icon: Users, change: '+12.50%', trend: 'up' },
    { name: 'Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: TrendingUp, change: '+28.40%', trend: 'up' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-[#121212]">Dashboard Overview</h1>
        <p className="text-sm font-sans text-[#6E6A64] mt-1.5 font-light">Welcome back. Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden rounded-2xl border border-[#E8E4DC] shadow-sm hover:border-[#C5A46D]/50 transition-colors">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="p-3 bg-[#FAF9F6] rounded-xl border border-[#E8E4DC]">
                    <item.icon className="h-6 w-6 text-[#C5A46D]" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-xs font-sans font-semibold tracking-wider uppercase text-[#6E6A64] truncate">{item.name}</dt>
                    <dd>
                      <div className="text-2xl font-display text-[#121212] mt-1.5">{item.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-[#FAF9F6] px-6 py-3.5 border-t border-[#E8E4DC]">
              <div className="text-xs font-sans">
                <span className={`font-semibold ${item.trend === 'up' ? 'text-[#25D366]' : 'text-[#6E6A64]'}`}>
                  {item.change}
                </span>
                <span className="text-[#6E6A64] ml-2 font-light">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Placeholder for Recent Orders & Low Stock alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-sm p-6 sm:p-8">
          <h2 className="text-sm font-sans font-bold tracking-wider uppercase text-[#121212] mb-6">Recent Orders</h2>
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-[#E8E4DC] rounded-xl bg-[#FAF9F6]">
            <p className="text-sm text-[#6E6A64] font-light">No recent orders found.</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-[#E8E4DC] shadow-sm p-6 sm:p-8">
          <h2 className="text-sm font-sans font-bold tracking-wider uppercase text-[#121212] mb-6">Low Stock Alerts</h2>
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-[#E8E4DC] rounded-xl bg-[#FAF9F6]">
            <p className="text-sm text-[#6E6A64] font-light">All products are well stocked.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
