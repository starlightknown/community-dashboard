import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const leaderboard = await prisma.userPoints.findMany({
      orderBy: { points: "desc" },
      take: 100,
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
