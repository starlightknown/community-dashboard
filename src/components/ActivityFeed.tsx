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
  "from-orange-500 to-orange-600",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-cyan-500 to-blue-500",
  "from-violet-500 to-indigo-500",
  "from-pink-500 to-rose-500",
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

const EMPTY_STATE: ActivityItem[] = [];

export default function ActivityFeed({ messages = [] }: { messages?: DiscordMessage[] }) {
  const activities = messages.length > 0 ? transformMessages(messages) : EMPTY_STATE;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          Announcements &amp; Updates
        </h2>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          <svg className="h-3 w-3 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 11.721 11.721 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.27a13.067 13.067 0 01-1.875-.893.077.077 0 01-.007-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.373.291a.077.077 0 01-.006.127 12.299 12.299 0 01-1.875.894.077.077 0 00-.11.27c.357.698.765 1.362 1.227 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          Discord Live
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-500 font-medium">No announcements yet</p>
          <p className="text-xs text-zinc-600 mt-1">Messages from #announcements and #product-updates will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="group relative flex items-start gap-4 p-4 rounded-xl border border-zinc-900/50 bg-zinc-950/40 hover:border-zinc-800/80 hover:bg-zinc-900/40 transition-all duration-300"
            >
              <div
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${activity.user.avatarGradient} font-bold text-white text-sm`}
              >
                {activity.user.initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                  <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                    {activity.user.name}
                    <span className="text-[#5865F2]" title="Discord Member">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 11.721 11.721 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.27a13.067 13.067 0 01-1.875-.893.077.077 0 01-.007-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.373.291a.077.077 0 01-.006.127 12.299 12.299 0 01-1.875.894.077.077 0 00-.11.27c.357.698.765 1.362 1.227 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </span>
                  </span>
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border text-orange-400 bg-orange-500/10 border-orange-500/20">
                    #{activity.channelName}
                  </span>
                  <span className="text-xs text-zinc-500 ml-auto">
                    {activity.time}
                  </span>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3">
                  {activity.content}
                </p>

                {activity.reactions > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {activity.reactions} reaction{activity.reactions !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
