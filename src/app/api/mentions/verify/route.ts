import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { awardPoints } from "@/lib/points";

export async function POST(request: Request) {
  try {
    const { submissionId, status, verifiedBy } = await request.json();

    if (!submissionId || !status) {
      return NextResponse.json(
        { error: "submissionId and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be APPROVED or REJECTED" },
        { status: 400 }
      );
    }

    const submission = await prisma.mentionSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json(
        { error: "Submission has already been verified" },
        { status: 400 }
      );
    }

    let pointsAwarded = 0;
    let message = "";

    if (status === "APPROVED") {
      // Award points
      const actionType = 
        submission.platform === "REDDIT" 
          ? "ZENCODER_MENTION_REDDIT" 
          : "ZENCODER_MENTION_X";

      const pointResult = await awardPoints(submission.memberId, actionType, {
        postUrl: submission.postUrl,
        submissionId,
      });

      pointsAwarded = pointResult.success ? pointResult.points : 0;
      message = "Mention approved and points awarded";
    } else {
      message = "Mention rejected";
    }

    // Update submission
    const updatedSubmission = await prisma.mentionSubmission.update({
      where: { id: submissionId },
      data: {
        status,
        verifiedAt: new Date(),
        verifiedBy,
        pointsAwarded: status === "APPROVED" ? pointsAwarded : null,
      },
    });

    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
      pointsAwarded,
      message,
    });
  } catch (error) {
    console.error("Error verifying mention:", error);
    return NextResponse.json({ error: "Failed to verify mention" }, { status: 500 });
  }
}
