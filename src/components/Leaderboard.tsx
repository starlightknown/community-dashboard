"use client";

import React from "react";

interface DiscordMember {
  user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
  };
  joined_at: string;
  roles: string[];
}

interface LeaderboardUser {
  rank: number;
  name: string;
  badge: string;
  points: string;
  gain: string;
  avatarGradient: string;
  initials: string;
  isDiscordLinked?: boolean;
  progress: number;
  role: string;
  roleColor: string;
}

function transformMembersToLeaderboard(members: DiscordMember[]): LeaderboardUser[] {
  return members
    .slice(0, 10)
    .map((member, index) => {
      const username = member.user.username;
      const initials = username
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      
      const hashCode = member.user.id.split("").reduce((a: number, b: string) => {
        const hash = a << 5 - a + b.charCodeAt(0);
        return hash & hash;
      }, 0);

      const points = Math.abs(hashCode % 3000) + 1000;
      const gain = Math.abs((hashCode >> 8) % 300);
      const progress = 70 + (Math.abs((hashCode >> 16) % 30));

      const avatarGradients = [
        "from-amber-400 to-yellow-500",
        "from-violet-400 to-indigo-500",
        "from-emerald-400 to-teal-500",
        "from-pink-400 to-rose-500",
        "from-blue-400 to-cyan-500",
      ];

      return {
        rank: index + 1,
        name: username,
        badge: index === 0 ? "Server Legend" : index === 1 ? "Top Contributor" : "Active Member",
        points: `${points.toLocaleString()} pts`,
        gain: `+${gain} this week`,
        avatarGradient: avatarGradients[index % avatarGradients.length],
        initials,
        isDiscordLinked: true,
        progress,
        role: member.roles.length > 0 ? "Member" : "Newbie",
        roleColor: index === 0 ? "text-amber-400 border-amber-400/20 bg-amber-400/5" : "text-violet-400 border-violet-400/20 bg-violet-400/5",
      };
    });
}

export default function Leaderboard({ members = [] }: { members?: DiscordMember[] }) {
  const contributors: LeaderboardUser[] = members.length > 0 
    ? transformMembersToLeaderboard(members)
    : [
    {
      rank: 1,
      name: "Ada Lovelace",
      badge: "Algorithm Queen",
      points: "3,120 pts",
      gain: "+340 this week",
      avatarGradient: "from-amber-400 to-yellow-500",
      initials: "AL",
      isDiscordLinked: true,
      progress: 92,
      role: "Server Legend",
      roleColor: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    },
    {
      rank: 2,
      name: "Linus Torvalds",
      badge: "Kernel Master",
      points: "2,850 pts",
      gain: "+240 this week",
      avatarGradient: "from-slate-300 to-slate-400",
      initials: "LT",
      isDiscordLinked: true,
      progress: 85,
      role: "Core Contributor",
      roleColor: "text-violet-400 border-violet-400/20 bg-violet-400/5",
    },
    {
      rank: 3,
      name: "Grace Hopper",
      badge: "Compiler Pioneer",
      points: "2,610 pts",
      gain: "+190 this week",
      avatarGradient: "from-amber-600 to-amber-700",
      initials: "GH",
      isDiscordLinked: false,
      progress: 78,
      role: "Moderator",
      roleColor: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
    },
    {
      rank: 4,
      name: "Guido van Rossum",
      badge: "Python Dictator",
      points: "2,180 pts",
      gain: "+120 this week",
      avatarGradient: "from-blue-500 to-indigo-600",
      initials: "GR",
      isDiscordLinked: true,
      progress: 64,
      role: "Pro Builder",
      roleColor: "text-blue-400 border-blue-400/20 bg-blue-400/5",
    },
    {
      rank: 5,
      name: "Satoshi Nakamoto",
      badge: "Genesis Architect",
      points: "1,950 pts",
      gain: "+90 this week",
      avatarGradient: "from-purple-500 to-pink-500",
      initials: "SN",
      isDiscordLinked: false,
      progress: 58,
      role: "Early Adopter",
      roleColor: "text-pink-400 border-pink-400/20 bg-pink-400/5",
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
            className="group relative flex flex-col gap-2 p-3 rounded-lg border border-zinc-900/50 bg-zinc-950/20 hover:bg-zinc-900/40 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex w-6 justify-center shrink-0">
                {getRankBadge(user.rank)}
              </div>

              <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${user.avatarGradient} font-bold text-black text-xs`}>
                {user.initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
                  {user.name}
                  {user.isDiscordLinked && (
                    <span className="text-[#5865F2]">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 11.721 11.721 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.27a13.067 13.067 0 01-1.875-.893.077.077 0 01-.007-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.373.291a.077.077 0 01-.006.127 12.299 12.299 0 01-1.875.894.077.077 0 00-.11.27c.357.698.765 1.362 1.227 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${user.roleColor}`}>
                    {user.role}
                  </span>
                  <span className="text-[10px] text-zinc-500 truncate italic">
                    {user.badge}
                  </span>
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
            
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-600/60 to-indigo-500/60"
                style={{ width: `${user.progress}%` }}
              ></div>
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
