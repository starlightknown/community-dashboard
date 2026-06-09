import { auth } from "@/lib/auth";
import { handleDiscordSignIn } from "@/app/actions";
import React from "react";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import ActionCards from "../../components/ActionCards";
import ActivityFeed from "../../components/ActivityFeed";
import Leaderboard from "../../components/Leaderboard";
import prisma from "@/lib/prisma";
import { getLeaderboard } from "@/lib/points";

const GUILD_ID = "1236805163784736850";

const BOT_HEADERS = {
  Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN || ""}`,
};

async function fetchGuildData() {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}?with_counts=true`,
      { headers: BOT_HEADERS, cache: "no-store" }
    );
    if (!response.ok) {
      console.error("Failed to fetch guild:", response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching guild:", error);
    return null;
  }
}

async function fetchMembersData() {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/members?limit=100`,
      { headers: BOT_HEADERS, cache: "no-store" }
    );
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

async function fetchChannelsData() {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/channels`,
      { headers: BOT_HEADERS, cache: "no-store" }
    );
    if (!response.ok) return [];
    const channels = await response.json();
    return channels.filter((ch: any) => ch.type === 0);
  } catch {
    return [];
  }
}

async function fetchChannelMessages(channelId: string, channelName: string) {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages?limit=20`,
      { headers: BOT_HEADERS, cache: "no-store" }
    );
    if (!response.ok) return [];
    const messages = await response.json();
    return messages.map((m: any) => ({ ...m, channelName }));
  } catch {
    return [];
  }
}

async function fetchAnnouncementMessages(channels: any[]) {
  const targetNames = ["announcements", "product-updates", "product_updates", "updates"];
  const targetChannels = channels.filter((ch: any) =>
    targetNames.some((name) => ch.name?.toLowerCase().includes(name))
  );

  if (targetChannels.length === 0) return [];

  const allMessages: any[] = [];
  for (const channel of targetChannels.slice(0, 3)) {
    const msgs = await fetchChannelMessages(channel.id, channel.name);
    allMessages.push(...msgs);
  }

  return allMessages
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);
}

async function syncMembers(members: any[]) {
  for (const member of members) {
    if (!member.user?.id || member.user?.bot) continue;
    try {
      await prisma.member.upsert({
        where: { id: member.user.id },
        update: {},
        create: {
          id: member.user.id,
          username: member.user.username || member.user.global_name || "Unknown",
        },
      });
    } catch {
    }
  }
}

async function getUserMemberData(discordId: string) {
  try {
    const member = await prisma.member.findUnique({
      where: { id: discordId },
      include: {
        socialLinks: {
          select: { platform: true, handle: true, verifiedAt: true },
        },
      },
    });
    return member;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const session = await auth();
  const guild = await fetchGuildData();

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-white">
        <Header />
        <main className="flex-1 pb-16 relative flex items-center justify-center">
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl shadow-[#5865F2]/20">
              <div className="h-16 w-16 bg-[#5865F2]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#5865F2]/20">
                <svg className="h-8 w-8 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 11.721 11.721 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.27a13.067 13.067 0 01-1.875-.893.077.077 0 01-.007-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.373.291a.077.077 0 01-.006.127 12.299 12.299 0 01-1.875.894.077.077 0 00-.11.27c.357.698.765 1.362 1.227 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Sync Discord Data</h2>
              <p className="text-zinc-400 mb-8 leading-relaxed text-sm">
                This dashboard tracks points and levels based on your activity in the Zencoder Discord server. Connect your account to see your real-time ranking.
              </p>
              <form action={handleDiscordSignIn}>
                <button
                  type="submit"
                  className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#5865F2]/20 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 11.721 11.721 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.27a13.067 13.067 0 01-1.875-.893.077.077 0 01-.007-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.373.291a.077.077 0 01-.006.127 12.299 12.299 0 01-1.875.894.077.077 0 00-.11.27c.357.698.765 1.362 1.227 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Authorize via Discord
                </button>
              </form>
              <p className="mt-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                Direct Server Sync Enabled
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const [members, channels] = await Promise.all([
    fetchMembersData(),
    fetchChannelsData(),
  ]);

  await syncMembers(members);

  const discordId = (session.user as any)?.id;

  const [leaderboard, announcementMessages, userMember] = await Promise.all([
    getLeaderboard("all-time", 10),
    fetchAnnouncementMessages(channels),
    discordId ? getUserMemberData(discordId) : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-white">
      <Header user={session.user} userMember={userMember as any} />
      <main className="flex-1 pb-16 relative">
        <Hero guild={guild} userMember={userMember as any} />
        <ActionCards />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ActivityFeed messages={announcementMessages} />
            </div>
            <div className="lg:col-span-1">
              <Leaderboard leaderboard={leaderboard} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
