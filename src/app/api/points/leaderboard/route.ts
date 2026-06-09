import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/points";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || 'all-time') as 'all-time' | 'weekly';
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500);

    const leaderboard = await getLeaderboard(period, limit);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
