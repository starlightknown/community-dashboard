"use client";

import React from "react";

export default function ActionCards() {
  const cards = [
    {
      title: "Server Intro Quest",
      description: "Send your first message in #introductions to earn a starter XP boost.",
      icon: (
        <svg
          className="h-6 w-6 text-orange-400 group-hover:scale-110 transition-transform duration-300"
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
      badge: "50 XP",
      badgeColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
      glowColor: "group-hover:border-orange-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(249,115,22,0.15)]",
    },
    {
      title: "Code Showcase",
      description: "Share a GitHub link in #showcase and get 5+ reactions for bonus points.",
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
      badge: "200 XP",
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      glowColor: "group-hover:border-emerald-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]",
    },
    {
      title: "Helping Hand",
      description: "Provide a solution in #help-desk. Tracked via 'Solved' bot reactions.",
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
      badge: "500 XP",
      badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      glowColor: "group-hover:border-rose-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(244,63,94,0.15)]",
    },
    {
      title: "Voice Hangout",
      description: "Spend 30 minutes in #builders-hangout voice channel during sync.",
      icon: (
        <svg
          className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      ),
      badge: "150 XP",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      glowColor: "group-hover:border-cyan-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.15)]",
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
