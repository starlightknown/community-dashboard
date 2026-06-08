"use client";

import React from "react";

interface LeaderboardUser {
  rank: number;
  name: string;
  badge: string;
  points: string;
  gain: string;
  avatarGradient: string;
  initials: string;
}

export default function Leaderboard() {
  const contributors: LeaderboardUser[] = [
    {
      rank: 1,
      name: "Ada Lovelace",
      badge: "Algorithm Queen",
      points: "3,120 pts",
      gain: "+340 this week",
      avatarGradient: "from-amber-400 to-yellow-500",
      initials: "AL",
    },
    {
      rank: 2,
      name: "Linus Torvalds",
      badge: "Kernel Master",
      points: "2,850 pts",
      gain: "+240 this week",
      avatarGradient: "from-slate-300 to-slate-400",
      initials: "LT",
    },
    {
      rank: 3,
      name: "Grace Hopper",
      badge: "Compiler Pioneer",
      points: "2,610 pts",
      gain: "+190 this week",
      avatarGradient: "from-amber-600 to-amber-700",
      initials: "GH",
    },
    {
      rank: 4,
      name: "Guido van Rossum",
      badge: "Python Dictator",
      points: "2,180 pts",
      gain: "+120 this week",
      avatarGradient: "from-blue-500 to-indigo-600",
      initials: "GR",
    },
    {
      rank: 5,
      name: "Satoshi Nakamoto",
      badge: "Genesis Architect",
      points: "1,950 pts",
      gain: "+90 this week",
      avatarGradient: "from-purple-500 to-pink-500",
      initials: "SN",
    },
  ];

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-black shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            👑
          </div>
        );
      case 2:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/40 text-xs font-black">
            2
          </div>
        );
      case 3:
        return (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 text-xs font-black">
            3
          </div>
        );
      default:
        return (
          <div className="flex h-6 w-6 items-center justify-center text-zinc-500 text-xs font-bold">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <svg
            className="h-5 w-5 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          Top Contributors
        </h2>
        <span className="rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-bold text-zinc-400 border border-zinc-800/80">
          This Month
        </span>
      </div>

      <div className="space-y-4">
        {contributors.map((user) => (
          <div
            key={user.rank}
            className="flex items-center gap-3 p-3 rounded-lg border border-zinc-900/50 bg-zinc-950/20 hover:bg-zinc-900/40 transition-all duration-200"
          >
            <div className="flex w-6 justify-center shrink-0">
              {getRankBadge(user.rank)}
            </div>

            <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarGradient} font-bold text-black text-xs`}>
              {user.initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">
                {user.name}
              </div>
              <div className="text-[10px] text-zinc-500 truncate">
                {user.badge}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-sm font-bold text-white tracking-tight">
                {user.points}
              </div>
              <div className="text-[10px] font-semibold text-emerald-400">
                {user.gain}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-zinc-800/60 pt-4 text-center">
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
        >
          View Full Standings
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
