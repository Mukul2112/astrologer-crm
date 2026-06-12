import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        client: { select: { name: true } },
        astrologer: { select: { name: true } },
      },
      orderBy: { dateTime: "asc" },
    });
    return NextResponse.json({ appointments });
  } catch {
    return NextResponse.json({ appointments: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const appointment = await prisma.appointment.create({
      data: {
        clientId: body.clientId,
        astrologerId: body.astrologerId,
        dateTime: new Date(body.dateTime),
        duration: body.duration || 60,
        type: body.type,
        fee: body.fee || 0,
        status: "SCHEDULED",
      },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
