import prisma from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Save, Truck, Receipt, Mail, Phone, Settings } from 'lucide-react';
import { updateStoreSettings } from '@/app/actions/adminSettings';

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  let settings = await prisma.storeSettings.findUnique({
    where: { id: 'global' }
  });

  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: {
        id: 'global',
        shippingFee: 150,
        taxRate: 18,
        contactEmail: 'support@womensworld.com',
        contactPhone: '+91 98765 43210',
      }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-[#121212]">Store Settings</h1>
        <p className="text-sm font-sans text-[#6E6A64] mt-1.5 font-light">
          Manage global configurations like shipping fees and tax rates.
        </p>
      </div>

      <div className="bg-white border border-[#E8E4DC] rounded-2xl shadow-sm p-6 sm:p-10 max-w-4xl">
        <form action={async (formData) => {
          'use server';
          await updateStoreSettings(formData);
        }} className="space-y-10">
          
          <div className="space-y-6">
            <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2 border-b border-[#E8E4DC] pb-4">
              <Receipt className="w-4 h-4 text-[#C5A46D]" /> Financial Settings
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1.5">
                  Flat Shipping Fee (₹)
                </label>
                <div className="relative">
                  <Truck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A46D]" />
                  <input 
                    type="number" 
                    name="shippingFee"
                    defaultValue={settings.shippingFee}
                    required
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-sm focus:outline-none focus:border-[#C5A46D] transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1.5">
                  Tax Rate (%)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#C5A46D]">%</span>
                  <input 
                    type="number" 
                    name="taxRate"
                    defaultValue={settings.taxRate}
                    required
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-sm focus:outline-none focus:border-[#C5A46D] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2 border-b border-[#E8E4DC] pb-4">
              <Settings className="w-4 h-4 text-[#C5A46D]" /> Contact Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1.5">
                  Support Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A46D]" />
                  <input 
                    type="email" 
                    name="contactEmail"
                    defaultValue={settings.contactEmail}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-sm focus:outline-none focus:border-[#C5A46D] transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1.5">
                  Support Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A46D]" />
                  <input 
                    type="text" 
                    name="contactPhone"
                    defaultValue={settings.contactPhone}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl text-sm focus:outline-none focus:border-[#C5A46D] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              className="px-8 py-3 bg-[#121212] text-white rounded-xl text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#C5A46D] transition-colors flex items-center gap-2 btn-magnetic"
            >
              Save Configuration <Save className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
