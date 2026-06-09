"use client";

import React from "react";

export default function ActionCards() {
  const cards = [
    {
      title: "Server Intro",
      description: "Introduce yourself in the #introductions channel to get started.",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      pts: "50",
      cadence: "One-time",
    },
    {
      title: "Helpful Answer",
      description: "Provide solutions and receive a ✅ from the thread author.",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      pts: "15",
      cadence: "Per answer",
    },
    {
      title: "Social Linking",
      description: "Connect your X or Reddit accounts via your dashboard profile.",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      pts: "75",
      cadence: "Bonus per link",
    },
    {
      title: "Public Mentions",
      description: "Mention Zencoder on social platforms and submit the URL for verification.",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.167H3.3a1.598 1.598 0 01-1.303-2.527l2.147-3.264H5.5a1.76 1.76 0 013.417.592l2.147 6.167" />
        </svg>
      ),
      pts: "30",
      cadence: "Verification req.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Earning Mechanics</h2>
        <div className="flex items-center gap-2 bg-[#FF6B2B]/10 px-3 py-1 rounded-full border border-[#FF6B2B]/20">
          <span className="text-[10px] font-bold text-[#FF6B2B] uppercase tracking-wider">🔥 5-Day Streak = 1.2× Boost</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors border border-white/5">
                {card.icon}
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white tabular-nums italic">+{card.pts}</div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">{card.cadence}</div>
              </div>
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{card.title}</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
