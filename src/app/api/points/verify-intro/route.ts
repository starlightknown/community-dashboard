import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/points";
import prisma from "@/lib/prisma";

const INTRO_CHANNEL_ID = "1250388238984675429";

export async function POST(request: Request) {
  try {
    const { memberId } = await request.json();

    if (!memberId) {
      return NextResponse.json({ error: "memberId is required" }, { status: 400 });
    }

    // Check if already awarded
    const alreadyAwarded = await prisma.pointEvent.findFirst({
      where: { memberId, actionType: "ONBOARDING_INTRO" },
    });

    if (alreadyAwarded) {
      return NextResponse.json({ error: "Intro points already claimed" }, { status: 400 });
    }

    // Fetch messages from introductions channel
    const response = await fetch(
      `https://discord.com/api/v10/channels/${INTRO_CHANNEL_ID}/messages?limit=100`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch Discord messages" }, { status: 500 });
    }

    const messages = await response.json();
    const userIntro = messages.find((m: any) => m.author.id === memberId);

    if (!userIntro) {
      return NextResponse.json(
        { error: "No message found in #introductions. Please introduce yourself first!" },
        { status: 404 }
      );
    }

    if (userIntro.content.length < 20) {
      return NextResponse.json(
        { error: "Your introduction is too short. Please provide a more detailed intro (min 20 chars)!" },
        { status: 400 }
      );
    }

    // Award points
    const result = await awardPoints(memberId, "ONBOARDING_INTRO", {
      channelId: INTRO_CHANNEL_ID,
      verifiedVia: "dashboard-claim",
      messageLength: userIntro.content.length,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error verifying intro:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
