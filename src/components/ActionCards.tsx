"use client";

import React from "react";

export default function ActionCards() {
  const cards = [
    {
      title: "Server Intro",
      description: "Post your first message in #introductions to earn a one-time 50 point welcome bonus.",
      icon: (
        <svg className="h-6 w-6 text-orange-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      badge: "+50 pts",
      badgeColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
      glowColor: "group-hover:border-orange-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(249,115,22,0.15)]",
      label: "One-time",
      labelColor: "text-orange-400 bg-orange-500/10",
    },
    {
      title: "Helpful Answer",
      description: "Solve someone's question and get a ✅ reaction from the thread author to earn 15 points.",
      icon: (
        <svg className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      badge: "+15 pts",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      glowColor: "group-hover:border-emerald-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]",
      label: "Per answer",
      labelColor: "text-emerald-400 bg-emerald-500/10",
    },
    {
      title: "Code Showcase",
      description: "Share a project or GitHub link in #showcase to earn 20 points. One per day.",
      icon: (
        <svg className="h-6 w-6 text-violet-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      badge: "+20 pts",
      badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      glowColor: "group-hover:border-violet-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(139,92,246,0.15)]",
      label: "Daily",
      labelColor: "text-violet-400 bg-violet-500/10",
    },
    {
      title: "Link Socials",
      description: "Link your Reddit or X account to earn 75 bonus points each. One-time reward per platform.",
      icon: (
        <svg className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      badge: "+75 pts",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      glowColor: "group-hover:border-cyan-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.15)]",
      label: "One-time × 2",
      labelColor: "text-cyan-400 bg-cyan-500/10",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">How to Earn Points</h2>
          <p className="text-sm text-zinc-500">Be active, helpful, and engaged to climb the leaderboard.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs font-bold text-orange-400">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          5-day streak = 1.2× bonus
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`group relative rounded-xl bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-6 transition-all duration-300 hover:-translate-y-1 cursor-default ${card.glowColor}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800/80 group-hover:border-zinc-700/60 transition-colors">
                {card.icon}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${card.badgeColor}`}>
                  {card.badge}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${card.labelColor}`}>
                  {card.label}
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-white mb-2 tracking-tight">
              {card.title}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
