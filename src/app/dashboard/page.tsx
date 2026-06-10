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

export const dynamic = "force-dynamic";

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
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 py-12 px-4 relative flex items-center justify-center">
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="max-w-2xl w-full bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-6 flex justify-center md:justify-start">
                    <img src="/logo.svg" alt="ZENCODER" className="h-8 w-auto" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4 italic tracking-tight">Welcome to Zencoder Community</h2>
                  <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
                    The ultimate hub for builders, creators, and innovators. Join thousands of developers contributing to the future of AI and software engineering.
                  </p>
                  
                  <div className="space-y-6 mb-10">
                    <div className="flex items-start gap-4 text-left">
                      <div className="h-10 w-10 bg-[#FF6B2B]/10 rounded-xl flex-shrink-0 flex items-center justify-center border border-[#FF6B2B]/20">
                        <svg className="h-5 w-5 text-[#FF6B2B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Competitive Leaderboard</h4>
                        <p className="text-[11px] text-zinc-500 leading-normal">Earn points for messages, helpful answers, and showcasing your work. Rise through the ranks from Lurker to Champion.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 text-left">
                      <div className="h-10 w-10 bg-[#3DD68C]/10 rounded-xl flex-shrink-0 flex items-center justify-center border border-[#3DD68C]/20">
                        <svg className="h-5 w-5 text-[#3DD68C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Exclusive Perks</h4>
                        <p className="text-[11px] text-zinc-500 leading-normal">Unlock special Discord roles, access private channels, and get early beta access to new Zencoder features.</p>
                      </div>
                    </div>
                  </div>

                  <form action={handleDiscordSignIn}>
                    <button
                      type="submit"
                      className="w-full bg-[#FF6B2B] hover:bg-[#E55A1F] text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 11.721 11.721 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.27a13.067 13.067 0 01-1.875-.893.077.077 0 01-.007-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.373.291a.077.077 0 01-.006.127 12.299 12.299 0 01-1.875.894.077.077 0 00-.11.27c.357.698.765 1.362 1.227 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      Authorize via Discord
                    </button>
                  </form>
                </div>
                <div className="hidden md:block flex-1 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global Stats</span>
                      <span className="text-[10px] font-bold text-[#3DD68C] uppercase">Live Sync</span>
                    </div>
                    {[
                      { label: "Community Members", value: "2.4k+" },
                      { label: "Code Submissions", value: "12k+" },
                      { label: "Helpful Answers", value: "850+" },
                      { label: "Project Showcases", value: "120+" }
                    ].map((stat, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-xs text-zinc-400 font-medium">{stat.label}</span>
                        <span className="text-xs text-white font-bold tabular-nums">{stat.value}</span>
                      </div>
                    ))}
                    <div className="pt-4 mt-4 border-t border-white/5">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-[9px] font-bold text-[#FF6B2B] uppercase tracking-widest mb-1">Latest Achievement</div>
                        <div className="text-[10px] text-white font-bold italic">@dev_alpha reached CHAMPION tier!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
    <div className="min-h-screen flex flex-col font-sans">
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
