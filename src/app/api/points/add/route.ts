import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, username, points } = await request.json();

    if (!userId || !username || points === undefined) {
      return NextResponse.json(
        { error: "userId, username, and points are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.userPoints.upsert({
      where: { userId },
      update: { points: { increment: points } },
      create: {
        userId,
        username,
        points,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error adding points:", error);
    return NextResponse.json({ error: "Failed to add points" }, { status: 500 });
  }
}
