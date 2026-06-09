import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { awardPoints } from "@/lib/points";

export async function POST(request: Request) {
  try {
    const { memberId, platform, handle } = await request.json();

    if (!memberId || !platform || !handle) {
      return NextResponse.json(
        { error: "memberId, platform, and handle are required" },
        { status: 400 }
      );
    }

    const validPlatforms = ["REDDIT", "X"];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json(
        { error: "Invalid platform. Must be REDDIT or X" },
        { status: 400 }
      );
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    // Check if already linked
    const existingLink = await prisma.socialLink.findUnique({
      where: {
        memberId_platform: {
          memberId,
          platform,
        },
      },
    });

    if (existingLink) {
      return NextResponse.json(
        { error: `${platform} account already linked` },
        { status: 400 }
      );
    }

    // Create social link
    const socialLink = await prisma.socialLink.create({
      data: {
        memberId,
        platform,
        handle,
        verifiedAt: new Date(),
      },
    });

    // Award points for social link
    const actionType = platform === "REDDIT" ? "SOCIAL_LINK_REDDIT" : "SOCIAL_LINK_X";
    const pointResult = await awardPoints(memberId, actionType, {
      handle,
      socialLinkId: socialLink.id,
    });

    // Update member with social handle
    const updateData: any = {};
    if (platform === "REDDIT") updateData.redditHandle = handle;
    if (platform === "X") updateData.xHandle = handle;

    await prisma.member.update({
      where: { id: memberId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      socialLink,
      pointsAwarded: pointResult.points,
      message: `${platform} account linked and ${pointResult.points} points awarded`,
    });
  } catch (error) {
    console.error("Error linking social account:", error);
    return NextResponse.json({ error: "Failed to link social account" }, { status: 500 });
  }
}
