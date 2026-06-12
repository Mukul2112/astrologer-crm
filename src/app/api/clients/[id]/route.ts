import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { dateTime: "desc" },
        include: { astrologer: { select: { name: true } } },
      },
      followUps: {
        orderBy: { dueDate: "asc" },
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  return NextResponse.json(client);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const client = await prisma.client.update({
      where: { id },
      data: {
        name: body.name,
        phone: body.phone || null,
        email: body.email || null,
        gender: body.gender || null,
        dob: body.dob ? new Date(body.dob) : null,
        birthTime: body.birthTime || null,
        birthPlace: body.birthPlace || null,
        zodiacSign: body.zodiacSign || null,
        consultationPreference: body.consultationPreference || null,
        notes: body.notes || null,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error("Failed to update client:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}
