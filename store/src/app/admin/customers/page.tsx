import prisma from '@/lib/prisma';
import { Users, Search, MoreVertical, ShieldCheck } from 'lucide-react';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      orders: {
        select: { totalAmount: true }
      }
    }
  });

  const formattedCustomers = customers.map(c => {
    const totalSpent = c.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      ...c,
      totalSpent,
      totalOrders: c.orders.length,
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-[#121212]">Customers</h1>
          <p className="text-sm font-sans text-[#6E6A64] mt-1.5 font-light">
            Manage your registered store customers and view their purchase history.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6A64]" />
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-[#E8E4DC] rounded-xl text-sm focus:outline-none focus:border-[#C5A46D] transition-colors"
          />
        </div>
      </div>

      <div className="bg-white border border-[#E8E4DC] rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E8E4DC]">
            <thead className="bg-[#FAF9F6]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-sans font-bold text-[#121212] uppercase tracking-wider">
                  Customer Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-sans font-bold text-[#121212] uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-sans font-bold text-[#121212] uppercase tracking-wider">
                  Orders
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-sans font-bold text-[#121212] uppercase tracking-wider">
                  Total Spent
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-sans font-bold text-[#121212] uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-sans font-bold text-[#121212] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E8E4DC]">
              {formattedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className="w-8 h-8 text-[#E8E4DC] mx-auto mb-3" />
                    <p className="text-sm text-[#6E6A64] font-light">No customers have registered yet.</p>
                  </td>
                </tr>
              ) : (
                formattedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-[#F4F0E8] rounded-full flex items-center justify-center">
                          <span className="text-[#C5A46D] font-display font-bold text-lg">
                            {customer.firstName[0]}{customer.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-sans font-bold text-[#121212]">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-xs text-[#6E6A64] mt-0.5">
                            ID: {customer.id.slice(-6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#2A2825] flex items-center gap-1.5">
                        {customer.email}
                        {customer.isEmailVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />}
                      </div>
                      <div className="text-xs text-[#6E6A64] mt-1 flex items-center gap-1.5">
                        {customer.phone || 'No phone'}
                        {customer.isPhoneVerified && <ShieldCheck className="w-3 h-3 text-[#25D366]" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-[#121212]">{customer.totalOrders}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-[#C5A46D]">
                        ₹{customer.totalSpent.toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6E6A64]">
                      {customer.createdAt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[#6E6A64] hover:text-[#121212] transition-colors p-1">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
