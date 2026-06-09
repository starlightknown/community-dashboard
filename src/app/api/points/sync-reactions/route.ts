import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/points";
import prisma from "@/lib/prisma";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const GUILD_ID = "1236805163784736850";

export async function POST(request: Request) {
  try {
    // Basic security for the automated cron job
    const authHeader = request.headers.get("Authorization");
    const isCron = request.headers.get("x-vercel-cron") === "1";
    
    if (!isCron && authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // 1. Get all text channels and threads
    const channelsRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/channels`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });
    const threadsRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/threads/active`, {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
    });

    if (!channelsRes.ok) return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 });
    
    const channels = await channelsRes.json();
    const threadsData = threadsRes.ok ? await threadsRes.json() : { threads: [] };
    
    const allRelevantChannels = [
        ...channels.filter((c: any) => [0, 5].includes(c.type)), // Text and Announcement
        ...threadsData.threads
    ];

    let awardedCount = 0;

    // 2. For each channel, scan recent messages
    for (const channel of allRelevantChannels) {
      const msgsRes = await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages?limit=50`, {
        headers: { Authorization: `Bot ${BOT_TOKEN}` },
      });
      if (!msgsRes.ok) continue;

      const messages = await msgsRes.json();
      for (const msg of messages) {
        // Look for ✅ reaction
        const checkReaction = msg.reactions?.find((r: any) => r.emoji.name === "✅");
        if (checkReaction) {
          // Fetch detailed reaction users to see WHO reacted
          const reactorsRes = await fetch(`https://discord.com/api/v10/channels/${channel.id}/messages/${msg.id}/reactions/✅`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
          });
          if (!reactorsRes.ok) continue;

          const reactors = await reactorsRes.json();
          const threadOwnerId = channel.owner_id; // For threads

          for (const reactor of reactors) {
            // If it's a thread and the owner reacted
            if (threadOwnerId && reactor.id === threadOwnerId && reactor.id !== msg.author.id) {
              // Check if we already awarded points for this specific message reaction
              const existing = await prisma.pointEvent.findFirst({
                where: {
                  actionType: "HELPFUL_ANSWER",
                  metadata: { contains: msg.id }
                }
              });

              if (!existing && !msg.author.bot) {
                await prisma.member.upsert({
                  where: { id: msg.author.id },
                  update: {},
                  create: { id: msg.author.id, username: msg.author.username },
                });

                await awardPoints(msg.author.id, "HELPFUL_ANSWER", {
                  messageId: msg.id,
                  channelId: channel.id,
                  verifiedVia: "manual-sync"
                });
                awardedCount++;
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true, awardedCount });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
