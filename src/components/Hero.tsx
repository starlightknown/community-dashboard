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

const TIER_THRESHOLDS = [
  { tier: "LURKER", label: "Lurker", min: 0, max: 99 },
  { tier: "MEMBER", label: "Member", min: 100, max: 499 },
  { tier: "BUILDER", label: "Builder", min: 500, max: 1499 },
  { tier: "CONTRIBUTOR", label: "Contributor", min: 1500, max: 3999 },
  { tier: "CHAMPION", label: "Champion", min: 4000, max: 1000000 },
];

export default function Hero({
  guild,
  userMember,
}: {
  guild: Guild | null;
  userMember?: UserMember | null;
}) {
  const currentTier = userMember?.tier || "LURKER";
  const totalPoints = userMember?.totalPoints ?? 0;
  
  const currentTierIdx = TIER_THRESHOLDS.findIndex(t => t.tier === currentTier);
  const nextTier = TIER_THRESHOLDS[currentTierIdx + 1] || TIER_THRESHOLDS[currentTierIdx];
  
  const progressPct = currentTier === "CHAMPION" 
    ? 100 
    : Math.min(100, Math.round((totalPoints / nextTier.min) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#FF6B2B] rounded-full animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF6B2B] uppercase">Live Community Data</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {guild?.name || "Zencoder"} Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-8 border-l border-white/10 pl-8 hidden md:flex">
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-1">Online</div>
            <div className="text-xl font-bold text-white">{guild?.approximate_presence_count?.toLocaleString() || "—"}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-1">Members</div>
            <div className="text-xl font-bold text-white">{guild?.approximate_member_count?.toLocaleString() || "—"}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Rank Card */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B2B]/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-[#FF6B2B]/10" />
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-2">Current Standing</div>
                <h2 className="text-4xl font-bold tracking-tight text-white mb-2 italic">
                  {TIER_THRESHOLDS[currentTierIdx]?.label || "Lurker"}
                </h2>
                <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
                  {currentTier === "LURKER" 
                    ? "Start your journey by introducing yourself in the Discord #introductions channel." 
                    : `Welcome back, ${userMember?.username || "Builder"}. You're a vital part of the Zencoder ecosystem.`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-1">Total Points</div>
                <div className="text-3xl font-bold text-white tabular-nums">{totalPoints.toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-white/5">
              <div className="flex justify-between items-end mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-white italic">{progressPct}%</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">to {nextTier.label}</span>
                </div>
                {userMember?.streakActive && (
                  <div className="flex items-center gap-2 bg-[#FF6B2B]/10 px-3 py-1 rounded-full border border-[#FF6B2B]/20">
                    <span className="text-[10px] font-bold text-[#FF6B2B] uppercase tracking-wider">🔥 {userMember.streakDays} Day Streak</span>
                  </div>
                )}
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#FF6B2B] rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(255,107,43,0.4)]" 
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tier Spine */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8">
          <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-8">Rank Progression</div>
          <div className="relative pl-6">
            <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-white/5" />
            <div className="space-y-6">
              {TIER_THRESHOLDS.map((t, i) => {
                const isDone = i < currentTierIdx;
                const isActive = i === currentTierIdx;
                return (
                  <div key={t.tier} className={`flex items-start gap-4 relative ${isActive ? '' : 'opacity-40 grayscale'}`}>
                    <div className={`mt-1.5 w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                      isDone ? 'border-[#FF6B2B] bg-[#FF6B2B]' : 
                      isActive ? 'border-[#FF6B2B] bg-black scale-125' : 'border-white/10 bg-black'
                    }`}>
                      {isDone && (
                        <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-bold tracking-tight ${isActive ? 'text-white italic' : 'text-zinc-400'}`}>
                        {t.label}
                      </div>
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">
                        {t.min.toLocaleString()} PTS
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
