import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const GUILD_ID = "1236805163784736850";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const botToken = process.env.DISCORD_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: "Bot token not configured" }, { status: 500 });
    }

    const response = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    const guild = await response.json();
    return NextResponse.json(guild);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch guild" }, { status: 500 });
  }
}
