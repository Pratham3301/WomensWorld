'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Menu,
  MessageCircle
} from 'lucide-react';
import { useState } from 'react';
import { logoutAdmin } from '@/app/actions/auth';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Reviews', href: '/admin/reviews', icon: MessageCircle },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/admin/login';
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#121212]/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#121212] transform transition-transform duration-200 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/admin" className="text-xl font-display tracking-widest uppercase text-white">
            Women's World
            <span className="block text-[10px] font-sans text-[#C5A46D] tracking-widest uppercase mt-1 font-semibold">
              Nashik Atelier Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-3 py-2.5 text-sm font-sans font-semibold tracking-wider uppercase rounded-xl transition-colors
                  ${isActive 
                    ? 'bg-[#C5A46D]/10 text-[#C5A46D]' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'}
                `}
              >
                <item.icon 
                  className={`flex-shrink-0 mr-3 h-4 w-4 ${isActive ? 'text-[#C5A46D]' : 'text-white/50'}`} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-sans font-semibold tracking-wider uppercase text-[#7A2232] rounded-xl hover:bg-[#7A2232]/10 transition-colors"
          >
            <LogOut className="flex-shrink-0 mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white border-b border-[#E8E4DC] md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-[#121212] hover:bg-[#FAF9F6] rounded-xl transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="text-lg font-display uppercase tracking-widest text-[#121212]">Admin</div>
          <div className="w-10" /> {/* Spacer */}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
