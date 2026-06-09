"use client";

import React from "react";

interface DiscordMessage {
  id: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
  };
  content: string;
  timestamp: string;
  reactions?: Array<{ emoji: { name: string }; count: number }>;
  channelName?: string;
}

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatarGradient: string;
    initials: string;
    isDiscordVerified: boolean;
  };
  channelName: string;
  content: string;
  time: string;
  reactions: number;
}

function formatTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

const GRADIENTS = [
  "from-[#FF6B2B] to-[#FF8B5B]",
  "from-[#3DD68C] to-[#6DE6AC]",
  "from-[#5B9CF6] to-[#8BBFF9]",
  "from-[#A855F7] to-[#C084FC]",
];

function getGradient(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash * 31 + username.charCodeAt(i)) | 0;
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function transformMessages(messages: DiscordMessage[]): ActivityItem[] {
  return messages.slice(0, 10).map((msg) => {
    const username = msg.author.username;
    const initials = username.slice(0, 2).toUpperCase();
    const totalReactions =
      msg.reactions?.reduce((sum, r) => sum + r.count, 0) ?? 0;

    return {
      id: msg.id,
      user: {
        name: username,
        avatarGradient: getGradient(username),
        initials,
        isDiscordVerified: true,
      },
      channelName: msg.channelName || "announcements",
      content: msg.content || "(No text content)",
      time: formatTimeAgo(msg.timestamp),
      reactions: totalReactions,
    };
  });
}

export default function ActivityFeed({ messages = [] }: { messages?: DiscordMessage[] }) {
  const activities = messages.length > 0 ? transformMessages(messages) : [];

  return (
    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Latest Announcements</h2>
        <div className="flex items-center gap-2 text-[10px] font-bold text-[#5865F2] tracking-widest uppercase">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 11.721 11.721 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.27a13.067 13.067 0 01-1.875-.893.077.077 0 01-.007-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.373.291a.077.077 0 01-.006.127 12.299 12.299 0 01-1.875.894.077.077 0 00-.11.27c.357.698.765 1.362 1.227 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          Sync
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {activities.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-sm text-zinc-600 font-bold uppercase tracking-widest italic">No updates available</div>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 flex gap-5 hover:bg-white/[0.02] transition-colors">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${activity.user.avatarGradient} flex-shrink-0 flex items-center justify-center text-[13px] font-bold text-black border border-white/10`}>
                {activity.user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex gap-3 items-baseline mb-2">
                  <span className="text-sm font-bold text-white italic tracking-tight">{activity.user.name}</span>
                  <span className="text-[9px] font-bold text-zinc-500 bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest border border-white/5">
                    #{activity.channelName}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-600 ml-auto uppercase tracking-tighter tabular-nums">{activity.time}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap break-words">{activity.content}</p>
                {activity.reactions > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="bg-white/5 px-2 py-1 rounded-md border border-white/5 flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-400">🔥</span>
                      <span className="text-[10px] font-bold text-zinc-400 tabular-nums">{activity.reactions}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
