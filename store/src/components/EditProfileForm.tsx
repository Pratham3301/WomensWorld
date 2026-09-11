'use client';

import { useState } from 'react';
import { User, Phone, Mail, Save, X } from 'lucide-react';
import { updateProfile } from '@/app/actions/profileActions';

export default function EditProfileForm({ customer }: { customer: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    const result = await updateProfile(formData);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setIsEditing(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-sm relative">
        <button 
          onClick={() => setIsEditing(true)}
          className="absolute top-6 right-6 text-xs font-sans font-bold uppercase tracking-wider text-[#C5A46D] hover:text-[#121212] transition-colors"
        >
          Edit
        </button>
        <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-[#121212] mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-[#C5A46D]" /> Contact Details
        </h2>
        <div className="space-y-3 font-sans text-sm text-[#2A2825] font-light">
          <p><span className="text-[#6E6A64] font-medium block text-xs uppercase tracking-wider mb-0.5">Name</span> {customer.firstName} {customer.lastName}</p>
          <p><span className="text-[#6E6A64] font-medium block text-xs uppercase tracking-wider mb-0.5">Email</span> {customer.email} {customer.isEmailVerified && <span className="text-[#25D366] text-[10px] ml-1 font-bold uppercase tracking-widest">(Verified)</span>}</p>
          <p><span className="text-[#6E6A64] font-medium block text-xs uppercase tracking-wider mb-0.5">Phone</span> {customer.phone || 'Not provided'} {customer.isPhoneVerified && <span className="text-[#25D366] text-[10px] ml-1 font-bold uppercase tracking-widest">(Verified)</span>}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] shadow-sm relative">
      <button 
        onClick={() => setIsEditing(false)}
        className="absolute top-6 right-6 text-[#6E6A64] hover:text-[#121212] transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-[#121212] mb-4 flex items-center gap-2">
        <User className="w-4 h-4 text-[#C5A46D]" /> Edit Profile
      </h2>
      
      <form action={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1">First Name</label>
            <input type="text" name="firstName" defaultValue={customer.firstName} required className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E8E4DC] rounded-lg text-sm focus:outline-none focus:border-[#C5A46D]" />
          </div>
          <div>
            <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1">Last Name</label>
            <input type="text" name="lastName" defaultValue={customer.lastName} required className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E8E4DC] rounded-lg text-sm focus:outline-none focus:border-[#C5A46D]" />
          </div>
        </div>
        
        <div>
          <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1">Email (Cannot be changed)</label>
          <input type="email" value={customer.email} disabled className="w-full px-3 py-2 bg-[#E8E4DC]/30 border border-[#E8E4DC] rounded-lg text-sm text-[#6E6A64] cursor-not-allowed" />
        </div>

        <div>
          <label className="block text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6E6A64] mb-1">Phone Number</label>
          <input type="tel" name="phone" defaultValue={customer.phone || ''} className="w-full px-3 py-2 bg-[#FAF9F6] border border-[#E8E4DC] rounded-lg text-sm focus:outline-none focus:border-[#C5A46D]" />
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-2.5 bg-[#121212] text-white rounded-lg text-xs font-sans font-bold uppercase tracking-wider hover:bg-[#C5A46D] transition-colors flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'} <Save className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
