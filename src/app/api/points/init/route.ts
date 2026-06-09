import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { members } = await request.json();

    if (!Array.isArray(members)) {
      return NextResponse.json({ error: "Members must be an array" }, { status: 400 });
    }

    for (const member of members) {
      const userId = member.user.id;
      const username = member.user.username;

      await prisma.member.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          username,
        },
      });
    }

    return NextResponse.json({ message: `Initialized ${members.length} members` });
  } catch (error) {
    console.error("Error initializing members:", error);
    return NextResponse.json({ error: "Failed to initialize members" }, { status: 500 });
  }
}
