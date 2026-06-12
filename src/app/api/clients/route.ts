import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const zodiac = searchParams.get("zodiacSign") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (zodiac) {
      where.zodiacSign = zodiac;
    }

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { appointments: true } },
        },
      }),
      prisma.client.count({ where }),
    ]);

    return NextResponse.json({
      clients,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ clients: [], total: 0, page: 1, totalPages: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get or create a default user for createdById
    let user = await prisma.user.findFirst();
    if (!user) {
      const bcrypt = await import("bcryptjs");
      user = await prisma.user.create({
        data: {
          email: "admin@astrocrm.com",
          password: await bcrypt.hash("password123", 12),
          name: "Admin",
          role: "ADMIN",
        },
      });
    }

    const client = await prisma.client.create({
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
        createdById: user.id,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Failed to create client:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
