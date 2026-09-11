"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const allowedStatuses = ["placed", "confirmed", "shipped", "delivered", "cancelled"] as const;

export async function updateOrderStatus(formData: FormData) {
  const orderId = String(formData.get("orderId") || "");
  const orderStatus = String(formData.get("orderStatus") || "");
  if (!orderId || !allowedStatuses.includes(orderStatus as (typeof allowedStatuses)[number])) return;

  await prisma.order.update({ where: { id: orderId }, data: { orderStatus } });
  revalidatePath("/admin");
}
