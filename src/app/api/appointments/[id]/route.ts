import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: body.status,
        dateTime: body.dateTime ? new Date(body.dateTime) : undefined,
        notes: body.notes,
        fee: body.fee,
      },
    });
    return NextResponse.json(appointment);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
