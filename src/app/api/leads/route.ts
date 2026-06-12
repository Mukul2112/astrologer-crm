import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

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

    // Send email notification (doesn't block the response)
    if (process.env.EMAIL_USER) {
      sendEmail({
        to: process.env.EMAIL_USER,
        subject: `New Lead Created: ${lead.client.name}`,
        html: `
          <h3>New Lead Opportunity</h3>
          <p><strong>Client:</strong> ${lead.client.name}</p>
          <p><strong>Stage:</strong> ${lead.stage}</p>
          <p><strong>Source:</strong> ${lead.source || 'Direct'}</p>
          <p>Log in to your CRM to follow up!</p>
        `,
      });
    }

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
