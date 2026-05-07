import { prisma } from "../config/database.js";

export async function generateOrderNumber() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const prefix = `LORD-${yyyy}${mm}`;
  const latest = await prisma.orders.findFirst({
    where: { orderNumber: { startsWith: prefix } },
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });
  const latestSequence = latest ? Number(latest.orderNumber.slice(prefix.length)) : 0;
  return `${prefix}${String(latestSequence + 1).padStart(2, "0")}`;
}
