"use client";

import React from "react";

export default function ActionCards() {
  const cards = [
    {
      title: "Introduce Yourself",
      description: "Say hello to the community and share your coding interests.",
      icon: (
        <svg
          className="h-6 w-6 text-violet-400 group-hover:scale-110 transition-transform duration-300"
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
      badge: "Onboarding",
      badgeColor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
      glowColor: "group-hover:border-violet-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(139,92,246,0.15)]",
    },
    {
      title: "Share a Project",
      description: "Push your latest build, get feedback, and find collaborators.",
      icon: (
        <svg
          className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      badge: "Showcase",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      glowColor: "group-hover:border-emerald-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]",
    },
    {
      title: "Help Someone (Q&A)",
      description: "Answer technical questions and earn reputation points.",
      icon: (
        <svg
          className="h-6 w-6 text-rose-400 group-hover:scale-110 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      badge: "Helpfulness",
      badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      glowColor: "group-hover:border-rose-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(244,63,94,0.15)]",
    },
    {
      title: "Join Discord Discussion",
      description: "Chat with the community on Discord, share ideas, and get instant help.",
      icon: (
        <svg
          className="h-6 w-6 text-[#5865F2] group-hover:scale-110 transition-transform duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 11.721 11.721 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.27a13.067 13.067 0 01-1.875-.893.077.077 0 01-.007-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.373.291a.077.077 0 01-.006.127 12.299 12.299 0 01-1.875.894.077.077 0 00-.11.27c.357.698.765 1.362 1.227 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
      badge: "Discord Hub",
      badgeColor: "text-[#5865F2] bg-[#5865F2]/10 border-[#5865F2]/20",
      glowColor: "group-hover:border-[#5865F2]/40 group-hover:shadow-[0_0_20px_-3px_rgba(88,101,242,0.15)]",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Community Actions</h2>
          <p className="text-sm text-zinc-500">Engage to earn XP and climb the leaderboard.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          2x Multiplier Active
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`group relative rounded-xl bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${card.glowColor}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 border border-zinc-800/80 group-hover:border-zinc-700/60 transition-colors">
                {card.icon}
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-violet-300 transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
