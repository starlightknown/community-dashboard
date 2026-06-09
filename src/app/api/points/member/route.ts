import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Member ID required" }, { status: 400 });
    }

    const [member, onboardingIntro] = await Promise.all([
      prisma.member.findUnique({
        where: { id },
        include: {
          socialLinks: {
            select: {
              platform: true,
              handle: true,
              verifiedAt: true,
            },
          },
        },
      }),
      prisma.pointEvent.findFirst({
        where: { memberId: id, actionType: "ONBOARDING_INTRO" },
      }),
    ]);

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...member,
      onboardingIntro: !!onboardingIntro,
    });
  } catch (error) {
    console.error("Error fetching member:", error);
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}
