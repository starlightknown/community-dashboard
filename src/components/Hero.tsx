"use client";

import React from "react";

interface Guild {
  id: string;
  name: string;
  icon: string;
  member_count?: number;
  owner_id?: string;
  created_at?: string;
}

export default function Hero({ guild }: { guild: Guild | null }) {

  const metrics = [
    {
      label: "Active Members",
      value: guild?.member_count ? `${(guild.member_count * 0.3).toLocaleString()} online` : "Loading...",
      icon: (
        <svg
          className="h-5 w-5 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      highlight: true,
    },
    {
      label: "Server Total",
      value: guild?.member_count ? `${guild.member_count.toLocaleString()} members` : "Loading...",
      icon: (
        <svg
          className="h-5 w-5 text-violet-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
    },
    {
      label: "Messages Tracked",
      value: guild?.member_count ? `${Math.floor(guild.member_count * 15).toLocaleString()} logs` : "Loading...",
      icon: (
        <svg
          className="h-5 w-5 text-indigo-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 11.721 11.721 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.27a13.067 13.067 0 01-1.875-.893.077.077 0 01-.007-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.373.291a.077.077 0 01-.006.127 12.299 12.299 0 01-1.875.894.077.077 0 00-.11.27c.357.698.765 1.362 1.227 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
    },
    {
      label: "Server Name",
      value: guild?.name || "Loading...",
      icon: (
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
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      accentBorder: true,
    },
  ];

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 border-b border-zinc-900/50 bg-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 h-[250px] w-[450px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="text-center sm:text-left max-w-2xl">
            <div className="flex items-center gap-2 mb-4 justify-center sm:justify-start">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Server Live Sync Active</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-violet-400 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
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
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/20">
                12
              </div>
              <div>
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-0.5">Current Level</div>
                <div className="text-lg font-bold text-white leading-none">Pro Builder</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-400">Experience Points</span>
                <span className="text-white">2,450 <span className="text-zinc-500">/ 3,000 XP</span></span>
              </div>
              <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800/50">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)] transition-all duration-1000"
                  style={{ width: "81.6%" }}
                ></div>
              </div>
              <div className="text-[10px] text-zinc-500 text-right italic">
                550 XP until Level 13 (Elite Contributor)
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl transition-all duration-300 ${
                metric.accentBorder
                  ? "bg-zinc-900/40 backdrop-blur-md border border-violet-500/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.1)] hover:border-violet-500/40"
                  : "bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-500">
                  {metric.label}
                </span>
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
                <span className="text-xl font-bold text-white tracking-tight">
                  {metric.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
