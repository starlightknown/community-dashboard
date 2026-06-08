import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  try {
    const { members } = await request.json();

    if (!Array.isArray(members)) {
      return NextResponse.json({ error: "Members must be an array" }, { status: 400 });
    }

    for (const member of members) {
      const userId = member.user.id;
      const username = member.user.username;

      await prisma.userPoints.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          username,
          points: 0,
        },
      });
    }

    return NextResponse.json({ message: `Initialized ${members.length} members with 0 points` });
  } catch (error) {
    console.error("Error initializing members:", error);
    return NextResponse.json({ error: "Failed to initialize members" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
