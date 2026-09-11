import prisma from '@/lib/prisma';
import { getCustomerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { logoutCustomer } from '@/app/actions/customerAuth';
import Link from 'next/link';
import { Package, User, LogOut } from 'lucide-react';
import EditProfileForm from '@/components/EditProfileForm';
import AddressBook from '@/components/AddressBook';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getCustomerSession();
  if (!session || session.role !== 'customer') {
    redirect('/login');
  }

  let customer = null;
  try {
    customer = await prisma.customer.findUnique({
      where: { id: session.userId as string },
      include: {
        addresses: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          include: { 
            items: { 
              include: { 
                product: { include: { images: true } },
                variant: true 
              } 
            } 
          },
        },
      },
    });
  } catch(e) {
    console.error("Database connection failed during build:", e);
  }

  if (!customer) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-12 pb-24 md:pt-20">
      <div className="max-w-[1024px] mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#E8E4DC]">
          <div>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#121212] text-[#C5A46D] rounded-full mb-4">
              <User className="w-5 h-5" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-[#121212] uppercase tracking-wider mb-2">
              Welcome, {customer.firstName}
            </h1>
            <p className="text-sm font-sans text-[#6E6A64] font-light">
              Manage your personal information and track your past orders.
            </p>
          </div>

          <form action={async () => {
            'use server';
            await logoutCustomer();
            redirect('/login');
          }}>
            <button className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#7A2232] hover:bg-[#7A2232]/5 px-4 py-2.5 rounded-full transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Profile Details */}
          <div className="md:col-span-1 space-y-8">
            <EditProfileForm customer={customer} />

            <AddressBook addresses={customer.addresses} />
          </div>

          {/* Order History */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-display uppercase tracking-widest text-[#121212] mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#C5A46D]" /> Order History
            </h2>

            <div className="space-y-6">
              {customer.orders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-[#E8E4DC] text-center shadow-sm">
                  <Package className="w-8 h-8 text-[#E8E4DC] mx-auto mb-3" />
                  <p className="text-sm font-sans text-[#6E6A64] font-light mb-6">
                    You haven't placed any orders yet.
                  </p>
                  <Link href="/category/women" className="inline-flex items-center justify-center px-6 py-3 bg-[#121212] text-white rounded-full text-xs font-sans font-semibold tracking-wider uppercase hover:bg-[#C5A46D] transition-colors btn-magnetic">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                customer.orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-[#E8E4DC] shadow-sm overflow-hidden">
                    <div className="bg-[#FAF9F6] p-4 sm:px-6 border-b border-[#E8E4DC] flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[#6E6A64] mb-0.5">
                          Order Placed
                        </p>
                        <p className="text-sm font-sans font-medium text-[#121212]">
                          {order.createdAt.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-sans font-semibold uppercase tracking-widest text-[#6E6A64] mb-0.5">
                          Total
                        </p>
                        <p className="text-sm font-sans font-medium text-[#121212]">
                          ₹{order.totalAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="text-right flex-grow">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#121212] text-[#C5A46D]">
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6">
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="relative w-16 h-20 bg-[#FAF9F6] rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={item.product.images?.[0]?.url || '/images/product_placeholder.jpg'} 
                                alt={item.product.name}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-grow">
                              <Link href={`/product/${item.product.id}`} className="text-sm font-sans font-semibold text-[#121212] hover:text-[#C5A46D] transition-colors line-clamp-1">
                                {item.product.name}
                              </Link>
                              <p className="text-xs text-[#6E6A64] mt-1 font-light">
                                Qty: {item.quantity} {item.variant?.size ? `| Size: ${item.variant.size}` : ''}
                              </p>
                            </div>
                            <div className="text-sm font-sans font-medium text-[#121212]">
                              ₹{item.priceAtPurchase.toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
