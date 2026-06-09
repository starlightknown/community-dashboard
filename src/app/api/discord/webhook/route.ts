import { NextResponse } from "next/server";
import { awardPoints } from "@/lib/points";
import prisma from "@/lib/prisma";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Discord webhook verification (simplified for now, ideally use NACL)
    // For local testing or if you don't have the public key yet
    
    const { t: eventType, d: data } = payload;

    if (eventType === "MESSAGE_REACTION_ADD") {
      const { emoji, user_id: reactorId, channel_id: channelId, message_id: messageId } = data;

      // Check if it's the checkmark emoji
      if (emoji.name === "✅") {
        console.log(`Processing ✅ reaction from ${reactorId} on message ${messageId}`);

        // 1. Fetch the message to get the author and see if it's in a thread
        const msgRes = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`, {
          headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });

        if (!msgRes.ok) {
          console.error("Failed to fetch message details");
          return NextResponse.json({ error: "Failed to fetch message" }, { status: 400 });
        }

        const message = await msgRes.json();
        const answerAuthorId = message.author.id;

        // 2. Fetch the channel to check if it's a thread and get the owner
        const chanRes = await fetch(`https://discord.com/api/v10/channels/${channelId}`, {
          headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });

        if (!chanRes.ok) {
          console.error("Failed to fetch channel details");
          return NextResponse.json({ error: "Failed to fetch channel" }, { status: 400 });
        }

        const channel = await chanRes.json();
        
        // Logic: If it's a thread (type 10, 11, or 12), only the thread owner can award points
        // If it's not a thread, we might need a different rule, but for now let's stick to the spec:
        // "Thread author marks reply with ✅ reaction"
        
        const isThread = [10, 11, 12].includes(channel.type);
        const threadOwnerId = channel.owner_id;

        if (isThread && reactorId === threadOwnerId && reactorId !== answerAuthorId) {
          console.log(`Awarding HELPFUL_ANSWER points to ${answerAuthorId}`);
          
          // Ensure answer author exists in our DB
          await prisma.member.upsert({
            where: { id: answerAuthorId },
            update: {},
            create: { id: answerAuthorId, username: message.author.username },
          });

          await awardPoints(answerAuthorId, "HELPFUL_ANSWER", {
            messageId,
            channelId,
            reactorId,
          });
        } else if (!isThread) {
            // If not a thread, maybe it's a general channel? 
            // The spec says "Thread author", so we might skip non-thread ✅
            console.log("Reaction not in a thread, skipping points award.");
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
