import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(parts);
  } catch {
    return NextResponse.json({ error: "Failed to fetch parts" }, { status: 500 });
  }
}

// POST - اضافه کردن پارت جدید
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, chassisNumbers } = body;

    if (!title || !chassisNumbers?.length) {
      return NextResponse.json({ error: "Title and chassis numbers are required" }, { status: 400 });
    }

    const part = await prisma.part.create({
      data: {
        title,
        chassisNumbers,
      },
    });

    return NextResponse.json(part, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create part" }, { status: 500 });
  }
}