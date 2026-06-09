import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { memberId, platform, postUrl } = await request.json();

    if (!memberId || !platform || !postUrl) {
      return NextResponse.json(
        { error: "memberId, platform, and postUrl are required" },
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

    // Check for duplicate approved submissions
    const existingApproved = await prisma.mentionSubmission.findFirst({
      where: {
        memberId,
        platform,
        postUrl,
        status: "APPROVED",
      },
    });

    if (existingApproved) {
      return NextResponse.json(
        { error: "This URL has already been submitted and approved" },
        { status: 400 }
      );
    }

    // Create mention submission
    const submission = await prisma.mentionSubmission.create({
      data: {
        memberId,
        platform,
        postUrl,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      submission,
      message: "Mention submission created and pending verification",
    });
  } catch (error) {
    console.error("Error submitting mention:", error);
    return NextResponse.json({ error: "Failed to submit mention" }, { status: 500 });
  }
}
