import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, subMonths, format } from "date-fns";

export async function GET() {
  try {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 6);

    const completedAppointments = await prisma.appointment.findMany({
      where: { status: "COMPLETED", dateTime: { gte: sixMonthsAgo } },
      select: { fee: true, dateTime: true, type: true },
    });

    const totalRevenue = completedAppointments.reduce((sum, a) => sum + a.fee, 0);

    const thisMonthStart = startOfMonth(now);
    const thisMonthAppts = completedAppointments.filter(
      (a) => new Date(a.dateTime) >= thisMonthStart
    );
    const thisMonth = thisMonthAppts.reduce((sum, a) => sum + a.fee, 0);

    const avgPerSession = completedAppointments.length > 0
      ? Math.round(totalRevenue / completedAppointments.length)
      : 0;

    // Monthly breakdown
    const monthlyMap = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const m = subMonths(now, i);
      monthlyMap.set(format(m, "MMM"), 0);
    }
    for (const a of completedAppointments) {
      const key = format(new Date(a.dateTime), "MMM");
      if (monthlyMap.has(key)) {
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + a.fee);
      }
    }
    const monthly = Array.from(monthlyMap, ([month, revenue]) => ({ month, revenue }));

    // Service breakdown
    const serviceMap = new Map<string, number>();
    for (const a of completedAppointments) {
      serviceMap.set(a.type, (serviceMap.get(a.type) || 0) + 1);
    }
    const services = Array.from(serviceMap, ([type, count]) => ({ type, count }));

    const topService = services.sort((a, b) => b.count - a.count)[0]?.type || "N/A";

    return NextResponse.json({ totalRevenue, thisMonth, avgPerSession, topService, monthly, services });
  } catch {
    return NextResponse.json({ totalRevenue: 0, thisMonth: 0, avgPerSession: 0, topService: "N/A", monthly: [], services: [] });
  }
}
