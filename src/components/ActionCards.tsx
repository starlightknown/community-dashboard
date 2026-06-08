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
      title: "Start a Conversation",
      description: "Start a thread about tech, frameworks, or Zencoder features.",
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      badge: "Discussion",
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      glowColor: "group-hover:border-cyan-500/40 group-hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.15)]",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
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
