import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ documents });
  } catch {
    return NextResponse.json({ documents: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    let uploadedById = body.uploadedById;
    if (!uploadedById) {
      const user = await prisma.user.findFirst();
      uploadedById = user?.id;
    }

    const document = await prisma.document.create({
      data: {
        fileName: body.fileName,
        filePath: body.filePath || "/mock-path.pdf",
        fileType: body.fileType || "application/pdf",
        fileSize: body.fileSize || 1024,
        clientId: body.clientId,
        uploadedById: uploadedById,
      },
    });
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
