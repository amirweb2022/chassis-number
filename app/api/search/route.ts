import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query) {
      return NextResponse.json([]);
    }

    const parts = await prisma.part.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { chassisNumbers: { has: query } },
        ],
      },
    });

    return NextResponse.json(parts);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}