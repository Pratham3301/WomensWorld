'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/app/actions/adminOrders';
import { Loader2 } from 'lucide-react';

const statuses = ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrderStatusDropdown({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsUpdating(true);
    await updateOrderStatus(orderId, newStatus);
    setIsUpdating(false);
  }

  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        onChange={handleChange}
        disabled={isUpdating}
        className={`text-xs font-medium px-2 py-1 rounded-full cursor-pointer border-none focus:ring-0 ${
          status === 'delivered' ? 'bg-green-100 text-green-800' :
          status === 'shipped' ? 'bg-purple-100 text-purple-800' :
          status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
          status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}
      >
        {statuses.map(s => (
          <option key={s} value={s}>{s.toUpperCase()}</option>
        ))}
      </select>
      {isUpdating && <Loader2 className="w-3 h-3 ml-1 animate-spin text-gray-500" />}
    </div>
  );
}
