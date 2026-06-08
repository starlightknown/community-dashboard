import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const guilds = await response.json();
    return NextResponse.json(guilds);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch guilds" }, { status: 500 });
  }
}
