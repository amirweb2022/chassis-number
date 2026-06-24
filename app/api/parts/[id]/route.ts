import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, chassisNumbers } = body;

    if (!title?.trim() || !chassisNumbers?.length) {
      return NextResponse.json(
        { error: "Title and chassis numbers are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.part.update({
      where: { id },
      data: {
        title: title.trim(),
        chassisNumbers,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update part" }, { status: 500 });
  }
}