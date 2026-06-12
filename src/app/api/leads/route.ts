import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        client: { select: { name: true, phone: true } },
        assignedAstrologer: { select: { name: true } },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ leads: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead = await prisma.lead.create({
      data: {
        clientId: body.clientId,
        stage: body.stage || "NEW_LEAD",
        source: body.source,
        assignedAstrologerId: body.assignedAstrologerId,
        lastContactDate: body.lastContactDate ? new Date(body.lastContactDate) : new Date(),
      },
      include: {
        client: { select: { name: true, phone: true } },
        assignedAstrologer: { select: { name: true } },
      },
    });
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
