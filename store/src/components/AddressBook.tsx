'use client';

import { useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import { addAddress, deleteAddress } from '@/app/actions/addressActions';

export default function AddressBook({ addresses }: { addresses: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAdd(formData: FormData) {
    setIsSubmitting(true);
    await addAddress(formData);
    setIsSubmitting(false);
    setIsAdding(false);
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-sm relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-[#121212] flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#C5A46D]" /> Saved Addresses
        </h2>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="text-xs font-sans font-bold uppercase tracking-wider text-[#C5A46D] hover:text-[#121212] transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        )}
      </div>

      {isAdding && (
        <form action={handleAdd} className="space-y-4 mb-6 p-4 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl">
          <div>
            <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1">Label (e.g., Home, Work)</label>
            <input type="text" name="label" defaultValue="Home" required className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded-lg text-sm focus:outline-none focus:border-[#C5A46D]" />
          </div>
          <div>
            <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1">Street Address</label>
            <input type="text" name="street" required className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded-lg text-sm focus:outline-none focus:border-[#C5A46D]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1">City</label>
              <input type="text" name="city" required className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded-lg text-sm focus:outline-none focus:border-[#C5A46D]" />
            </div>
            <div>
              <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1">State</label>
              <input type="text" name="state" required className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded-lg text-sm focus:outline-none focus:border-[#C5A46D]" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1">Pincode</label>
            <input type="text" name="pincode" required className="w-full px-3 py-2 bg-white border border-[#E8E4DC] rounded-lg text-sm focus:outline-none focus:border-[#C5A46D]" />
          </div>
          <div className="flex gap-2 mt-4">
            <button 
              type="button" 
              onClick={() => setIsAdding(false)}
              className="flex-1 py-2 bg-white border border-[#E8E4DC] text-[#121212] rounded-lg text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#FAF9F6] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 py-2 bg-[#121212] text-white rounded-lg text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#C5A46D] transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="font-sans text-sm text-[#6E6A64] font-light italic">
          No addresses saved yet.
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map(address => (
            <div key={address.id} className="p-4 bg-[#FAF9F6] border border-[#E8E4DC] rounded-xl flex justify-between items-start">
              <div>
                <p className="text-xs font-sans font-bold uppercase tracking-wider text-[#121212] mb-1 flex items-center gap-2">
                  {address.label} {address.isDefault && <span className="px-1.5 py-0.5 bg-[#C5A46D]/10 text-[#C5A46D] rounded text-[9px] uppercase tracking-widest">Default</span>}
                </p>
                <p className="text-sm font-sans text-[#6E6A64] font-light mt-1">{address.street}</p>
                <p className="text-sm font-sans text-[#6E6A64] font-light">{address.city}, {address.state} {address.pincode}</p>
              </div>
              <button 
                onClick={() => deleteAddress(address.id)}
                className="text-[#6E6A64] hover:text-red-500 transition-colors p-1"
                aria-label="Delete address"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
