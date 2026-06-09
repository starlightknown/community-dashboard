"use client";

import React from "react";

interface Member {
  id: string;
  username: string;
  totalPoints: number;
  weeklyPoints: number;
  tier: string;
  streakDays: number;
  streakActive: boolean;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  points: string;
  gain: string;
  avatarGradient: string;
  initials: string;
  isDiscordLinked?: boolean;
}

function transformDBToLeaderboard(members: Member[]): LeaderboardUser[] {
  const avatarGradients = [
    "from-[#FF6B2B] to-[#FF8B5B]",
    "from-[#3DD68C] to-[#6DE6AC]",
    "from-[#5B9CF6] to-[#8BBFF9]",
    "from-[#A855F7] to-[#C084FC]",
  ];

  return members.slice(0, 10).map((member, index) => {
    const initials = member.username.slice(0, 2).toUpperCase();

    return {
      rank: index + 1,
      name: member.username,
      points: `${member.totalPoints.toLocaleString()} pts`,
      gain: `+${member.weeklyPoints}`,
      avatarGradient: avatarGradients[index % avatarGradients.length],
      initials,
      isDiscordLinked: true,
    };
  });
}

export default function Leaderboard({ leaderboard = [] }: { leaderboard?: Member[] }) {
  const users = transformDBToLeaderboard(leaderboard);

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Top Builders</h2>
        <span className="text-[9px] font-bold text-white bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest border border-white/5">All-Time</span>
      </div>

      <div className="divide-y divide-white/5">
        {users.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-sm text-zinc-600 font-bold uppercase tracking-widest italic">No participants</div>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.rank} className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="w-4 text-[10px] font-bold text-zinc-600 tabular-nums">{user.rank}</div>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${user.avatarGradient} flex-shrink-0 flex items-center justify-center text-[12px] font-bold text-black border border-white/10`}>
                {user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white italic truncate tracking-tight">{user.name}</div>
                <div className="text-[10px] text-[#FF6B2B] font-bold uppercase tracking-wider mt-0.5">{user.gain} <span className="text-zinc-600 font-normal lowercase ml-1">weekly</span></div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-white tabular-nums">{user.points.replace(' pts', '')}</div>
                <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">PTS</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-5 border-t border-white/5 bg-white/[0.01]">
        <button className="w-full py-2 text-[10px] font-bold text-zinc-500 hover:text-[#FF6B2B] transition-all uppercase tracking-[0.2em] active:scale-[0.98]">
          View Full Standings
        </button>
      </div>
    </div>
  );
}
