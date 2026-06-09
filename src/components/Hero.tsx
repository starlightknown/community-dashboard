"use client";

import React from "react";

interface Guild {
  id: string;
  name: string;
  icon: string;
  member_count?: number;
  approximate_member_count?: number;
  approximate_presence_count?: number;
  owner_id?: string;
}

interface UserMember {
  id: string;
  username: string;
  totalPoints: number;
  weeklyPoints: number;
  tier: string;
  streakDays: number;
  streakActive: boolean;
}

const TIER_NEXT: Record<string, { next: string; max: number }> = {
  LURKER: { next: "Member", max: 100 },
  MEMBER: { next: "Builder", max: 500 },
  BUILDER: { next: "Contributor", max: 1500 },
  CONTRIBUTOR: { next: "Champion", max: 4000 },
  CHAMPION: { next: "Champion", max: 4000 },
};

const TIER_LABELS: Record<string, string> = {
  LURKER: "Lurker",
  MEMBER: "Member",
  BUILDER: "Builder",
  CONTRIBUTOR: "Contributor",
  CHAMPION: "Champion",
};

export default function Hero({
  guild,
  userMember,
}: {
  guild: Guild | null;
  userMember?: UserMember | null;
}) {
  const metrics = [
    {
      label: "Active Members",
      value: guild?.approximate_presence_count
        ? `${guild.approximate_presence_count.toLocaleString()} online`
        : "Loading...",
      icon: (
        <svg className="h-5 w-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      highlight: true,
    },
    {
      label: "Server Total",
      value: guild?.approximate_member_count
        ? `${guild.approximate_member_count.toLocaleString()} members`
        : "Loading...",
      icon: (
        <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
    {
      label: "Your Weekly XP",
      value: userMember ? `${userMember.weeklyPoints} pts` : "—",
      icon: (
        <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Server Name",
      value: guild?.name || "Loading...",
      icon: (
        <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      accentBorder: true,
    },
  ];

  const tierLabel = userMember ? TIER_LABELS[userMember.tier] || userMember.tier : "—";
  const nextTierInfo = userMember ? TIER_NEXT[userMember.tier] : null;
  const progressPct =
    userMember && nextTierInfo && userMember.tier !== "CHAMPION"
      ? Math.min(100, Math.round((userMember.totalPoints / nextTierInfo.max) * 100))
      : userMember?.tier === "CHAMPION"
      ? 100
      : 0;
  const ptsToNext =
    userMember && nextTierInfo && userMember.tier !== "CHAMPION"
      ? nextTierInfo.max - userMember.totalPoints
      : 0;

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 border-b border-zinc-900/50 bg-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 h-[250px] w-[450px] rounded-full bg-orange-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="text-center sm:text-left max-w-2xl">
            <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Server Live Sync Active</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Zencoder Community
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400">
              Where builders share, learn, and grow together on Discord.
            </p>
          </div>

          <div className="flex-1 max-w-md w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live XP
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/20">
                {tierLabel.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-0.5">Current Rank</div>
                <div className="text-lg font-bold text-white leading-none">{tierLabel}</div>
              </div>
            </div>

            {userMember ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-400">Total Points</span>
                  <span className="text-white">
                    {userMember.totalPoints.toLocaleString()}
                    {nextTierInfo && userMember.tier !== "CHAMPION" && (
                      <span className="text-zinc-500"> / {nextTierInfo.max.toLocaleString()} pts</span>
                    )}
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                  <div
                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all duration-1000"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                {userMember.tier !== "CHAMPION" && ptsToNext > 0 ? (
                  <div className="text-[10px] text-zinc-500 text-right italic">
                    {ptsToNext.toLocaleString()} pts until {nextTierInfo?.next}
                  </div>
                ) : userMember.tier === "CHAMPION" ? (
                  <div className="text-[10px] text-orange-400 text-right font-bold">
                    🏆 Max rank achieved
                  </div>
                ) : null}
                {userMember.streakActive && (
                  <div className="text-[10px] text-amber-400 flex items-center gap-1">
                    🔥 {userMember.streakDays}-day streak active (+20% bonus points!)
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-zinc-400">Points</span>
                  <span className="text-zinc-500">Syncing...</span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                  <div className="h-full w-0 bg-gradient-to-r from-orange-600 to-orange-400 rounded-full" />
                </div>
                <div className="text-[10px] text-zinc-600 text-right italic">
                  Post in #introductions to earn your first 50 points!
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl transition-all duration-300 ${
                metric.accentBorder
                  ? "bg-zinc-900/40 backdrop-blur-md border border-orange-500/20 shadow-[0_0_15px_-3px_rgba(249,115,22,0.1)] hover:border-orange-500/40"
                  : "bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-500">{metric.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 border border-zinc-800/80">
                  {metric.icon}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {metric.highlight && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
                <span className="text-xl font-bold text-white tracking-tight">{metric.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
