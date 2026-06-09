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
const ANNOUNCEMENT_CHANNELS = [
  { id: "1250388146114265159", name: "announcements" },
  { id: "1250388204159500319", name: "product-updates" },
];

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

async function fetchAnnouncementMessages() {
  const allMessages: any[] = [];
  for (const channel of ANNOUNCEMENT_CHANNELS) {
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
              <div className="mb-8 flex justify-center">
                <svg
                  className="h-8 w-auto text-orange-500"
                  viewBox="0 0 790 150"
                  fill="currentColor"
                >
                  <g>
                    <path d="M62.65,103.23c-1.91-6.44-5.14-14.11-11.75-16.93-6.69-2.61-14.32.5-19.8,4.45-4.11,3.02-7.69,7.04-9.59,11.86-.64,1.64-1.09,3.35-1.31,5.09-.26,1.74-.5,3.49-.47,5.25.2,11.44,6.37,22.44,14.86,29.88,4.62,3.94,10.61,7.58,16.97,7.12,10.14-1.04,12.09-13.55,13.18-21.68.46-3.36.49-6.75.33-10.13-.26-5.05-1.03-10.04-2.42-14.92Z"/>
                    <path d="M121.56,105.88c-3.06-1.48-6.27-2.56-9.53-3.44-4.88-1.31-9.87-2.13-14.94-2.31-6.72-.18-15.01.52-19.73,5.94-4.55,5.56-3.95,13.78-1.88,20.21,1.6,4.84,4.32,9.48,8.32,12.79,1.36,1.11,2.85,2.07,4.44,2.82,1.57.78,3.16,1.55,4.85,2.07,10.94,3.35,23.31.88,33.01-4.9,5.17-3.17,10.49-7.75,12.01-13.94,2.15-9.97-9.15-15.68-16.55-19.24Z"/>
                    <path d="M150.77,50.86c-1.42-5.9-4.13-12.37-9.54-15.73-8.81-5.12-17.74,3.86-23.41,9.79-2.35,2.45-4.37,5.17-6.22,8-2.75,4.24-5.07,8.73-6.81,13.49-2.24,6.34-4.14,14.44-.44,20.6,3.88,6.04,11.88,8.02,18.63,8.03,5.1-.02,10.36-1.18,14.73-3.96,1.48-.95,2.85-2.07,4.05-3.35,1.23-1.25,2.45-2.53,3.47-3.97,6.57-9.37,8.04-21.9,5.54-32.91Z"/>
                    <path d="M94.56,55.46c6.95-1.82,11.29-8.82,13.4-15.24,1.55-4.86,2.08-10.21.79-15.24-.45-1.7-1.09-3.35-1.93-4.89-.81-1.55-1.64-3.11-2.71-4.52C97.22,6.43,85.76,1.17,74.52.14c-6.05-.47-13.04.1-17.91,4.22-7.6,6.8-1.82,18.07,2.08,25.29,1.6,2.99,3.57,5.75,5.69,8.38,3.18,3.93,6.73,7.52,10.73,10.65,5.33,4.09,12.45,8.4,19.46,6.79Z"/>
                    <path d="M35.62,78.34c4.72-1.81,9.23-4.08,13.44-6.91,5.54-3.81,11.83-9.25,12.47-16.41.41-7.17-4.9-13.47-10.35-17.45-4.14-2.98-9.07-5.13-14.25-5.46-1.75-.1-3.52,0-5.24.33-1.73.29-3.47.6-5.14,1.17-10.82,3.72-19.37,12.99-23.82,23.37-2.32,5.61-3.93,12.44-1.53,18.34,4.12,9.33,16.62,7.31,24.69,5.84,3.34-.6,6.57-1.62,9.73-2.82Z"/>
                  </g>
                  <g>
                    <path d="M200,91.93l36.02-30.03v-1.19h-35.14v-9.73h52.66v7l-36.02,30.23v2.1l36.02-1v9.73h-53.54v-7.1Z"/>
                    <path d="M326.64,77.92h-49.64c.88,7.3,5.55,13.23,20.25,13.23,12.75,0,17.23-3.79,18.01-7.78h11.39c-.58,8.37-8.86,16.63-29.4,16.63-25.41,0-32.8-12.65-32.8-24.61,0-15.37,11.78-25.39,32.03-25.39s30.18,9.14,30.18,24.03v3.89ZM315.26,70.14c0-6.42-5.16-11.28-18.3-11.28-12.07,0-17.91,4.09-19.56,11.58h37.87v-.29Z"/>
                    <path d="M340.86,50.97h12.46l-.19,14.1h1.19c3.6-9.82,10.39-15.08,25.96-15.08,19.66,0,26.57,9.44,26.57,21.21v27.82h-12.46v-24.51c0-8.56-4.38-14.3-18.79-14.3-11.68,0-22.29,5.54-22.29,17.22v21.6h-12.46v-48.05Z"/>
                    <path d="M420.58,75c0-13.62,10.61-25,31.73-25s29.4,9.02,29.4,19.43l-11.39,1c-.1-5.45-4.87-10.7-17.81-10.7s-19.47,6.71-19.47,15.27c0,8.07,5.06,15.27,18.98,15.27s18.4-5.06,18.49-10.51l11.39,1c0,10.02-7.88,19.23-30.37,19.23s-30.95-12.84-30.95-25Z"/>
                    <path d="M495.15,75.1c0-12.65,9.34-25.1,33-25.1s33,12.45,33,25.1-9.15,24.9-33,24.9-33-12.16-33-24.9ZM548.68,75.1c0-7.98-5.55-15.37-20.54-15.37s-20.54,7.39-20.54,15.37,5.45,15.17,20.54,15.17,20.54-7.2,20.54-15.17Z"/>
                    <path d="M574.39,74.42c0-13.52,11-24.42,30.95-24.42,13.53,0,19.93,3.79,22.46,10.41h1.1v-23.21h12.46v61.83h-12.46v-12.35h-1.19c-2.34,7.88-8.83,13.33-23.24,13.33-19.47,0-30.56-10.12-30.56-25.58ZM628.9,75v-1.46c0-7.59-7.01-13.81-21.8-13.81-13.53,0-20.34,6.32-20.34,14.69,0,9.73,7.49,15.86,20.25,15.86,14.6,0,21.9-8.76,21.9-15.27Z"/>
                    <path d="M718.06,77.92h-49.64c.88,7.3,5.55,13.23,20.25,13.23,12.75,0,17.23-3.79,18.01-7.78h11.39c-.58,8.37-8.86,16.63-29.4,16.63-25.41,0-32.8-12.65-32.8-24.61,0-15.37,11.78-25.39,32.03-25.39s30.18,9.14,30.18,24.03v3.89ZM706.67,70.14c0-6.42-5.16-11.28-18.3-11.28-12.07,0-17.91,4.09-19.56,11.58h37.87v-.29Z"/>
                    <path d="M732.28,50.97h12.46l-.19,14.69h1.19c3.02-8.66,8.83-15.66,22.36-15.66,15.87,0,21.9,8.75,21.9,22.18,0,3.7-.19,7-.29,8.56h-11.68c.1-1.17.19-3.21.19-4.96,0-10.31-3.41-15.56-13.72-15.56-12.75,0-19.76,9.92-19.76,20.62v18.19h-12.46v-48.05Z"/>
                  </g>
                </svg>
              </div>
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

  const members = await fetchMembersData();

  await syncMembers(members);

  const discordId = (session.user as any)?.id;

  if (discordId) {
    try {
      await prisma.member.upsert({
        where: { id: discordId },
        update: {},
        create: {
          id: discordId,
          username: session.user?.name || session.user?.email || "Unknown",
        },
      });
    } catch {}
  }

  const [leaderboard, announcementMessages, userMember] = await Promise.all([
    getLeaderboard("all-time", 10),
    fetchAnnouncementMessages(),
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
