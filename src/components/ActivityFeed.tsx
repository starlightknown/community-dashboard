"use client";

import React, { useState } from "react";

interface DiscordMessage {
  id: string;
  author: {
    id: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  reactions?: Array<{ emoji: { name: string }; count: number }>;
}

interface ActivityItem {
  id: string;
  user: {
    name: string;
    tag: string;
    tagStyle: string;
    avatarGradient: string;
    initials: string;
    isDiscordVerified?: boolean;
  };
  actionType: string;
  targetTitle: string;
  targetHref: string;
  time: string;
  tags: string[];
  upvotes: number;
  replies: number;
  hasUpvoted?: boolean;
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

function transformMessagesToActivities(messages: DiscordMessage[]): ActivityItem[] {
  const tagStyles = [
    "text-violet-400 bg-violet-500/10 border-violet-500/20",
    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    "text-amber-400 bg-amber-500/10 border-amber-500/20",
    "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  ];

  const avatarGradients = [
    "from-violet-500 to-fuchsia-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-cyan-500 to-blue-500",
  ];

  return messages.slice(0, 8).map((msg, index) => {
    const username = msg.author.username;
    const initials = username
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const hashCode = msg.id.split("").reduce((a: number, b: string) => {
      const hash = a << 5 - a + b.charCodeAt(0);
      return hash & hash;
    }, 0);

    return {
      id: msg.id,
      user: {
        name: username,
        tag: "Community Member",
        tagStyle: tagStyles[index % tagStyles.length],
        avatarGradient: avatarGradients[index % avatarGradients.length],
        initials,
        isDiscordVerified: true,
      },
      actionType: "sent a message in #general",
      targetTitle: msg.content.slice(0, 100),
      targetHref: "#",
      time: formatTimeAgo(msg.timestamp),
      tags: ["Discord", "Message"],
      upvotes: Math.abs(hashCode % 50),
      replies: Math.abs((hashCode >> 8) % 10),
    };
  });
}

export default function ActivityFeed({ messages = [] }: { messages?: DiscordMessage[] }) {
  const [activities, setActivities] = useState<ActivityItem[]>(
    messages.length > 0 ? transformMessagesToActivities(messages) : [
    {
      id: "1",
      user: {
        name: "Sarah Connor",
        tag: "Core Contributor",
        tagStyle: "text-violet-400 bg-violet-500/10 border-violet-500/20",
        avatarGradient: "from-violet-500 to-fuchsia-500",
        initials: "SC",
        isDiscordVerified: true,
      },
      actionType: "sent a message in #announcements",
      targetTitle: "Zencoder v4 is now in public beta!",
      targetHref: "#",
      time: "12m ago",
      tags: ["Discord", "Announcement"],
      upvotes: 42,
      replies: 5,
    },
    {
      id: "2",
      user: {
        name: "Alex Mercer",
        tag: "Tech Lead",
        tagStyle: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        avatarGradient: "from-emerald-500 to-teal-500",
        initials: "AM",
        isDiscordVerified: true,
      },
      actionType: "earned a 'Helper' badge on Discord",
      targetTitle: "Assisting 50+ members this month",
      targetHref: "#",
      time: "2h ago",
      tags: ["Discord", "Level Up"],
      upvotes: 28,
      replies: 12,
    },
    {
      id: "3",
      user: {
        name: "Elena Rostova",
        tag: "New Member",
        tagStyle: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        avatarGradient: "from-cyan-500 to-blue-500",
        initials: "ER",
        isDiscordVerified: true,
      },
      actionType: "joined a voice session in #builders-hangout",
      targetTitle: "Weekly community sync and Q&A",
      targetHref: "#",
      time: "5h ago",
      tags: ["Discord", "Voice"],
      upvotes: 19,
      replies: 3,
    },
    {
      id: "4",
      user: {
        name: "Marcus Aurelius",
        tag: "Pro Builder",
        tagStyle: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        avatarGradient: "from-amber-500 to-orange-500",
        initials: "MA",
        isDiscordVerified: false,
      },
      actionType: "shared a new repo",
      targetTitle: "meditations-generator-cli",
      targetHref: "#",
      time: "1d ago",
      tags: ["NextJS", "Tailwindv4", "Creative"],
      upvotes: 64,
      replies: 8,
    },
  ]);

  const handleUpvote = (id: string) => {
    setActivities((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const hasUpvoted = !item.hasUpvoted;
          return {
            ...item,
            hasUpvoted,
            upvotes: hasUpvoted ? item.upvotes + 1 : item.upvotes - 1,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
          Recent Activity
        </h2>
        <div className="flex gap-2">
          <button className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 border border-zinc-800 hover:text-white transition-colors">
            All
          </button>
          <button className="rounded-lg bg-transparent px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">
            Trending
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="group relative flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-zinc-900/50 bg-zinc-950/40 hover:border-zinc-800/80 hover:bg-zinc-900/40 transition-all duration-300"
          >
            <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${activity.user.avatarGradient} font-bold text-white text-sm`}>
              {activity.user.initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  {activity.user.name}
                  {activity.user.isDiscordVerified && (
                    <span className="text-[#5865F2]" title="Discord Linked">
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 11.721 11.721 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.052-.102.001-.226-.112-.27a13.067 13.067 0 01-1.875-.893.077.077 0 01-.007-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.099.246.197.373.291a.077.077 0 01-.006.127 12.299 12.299 0 01-1.875.894.077.077 0 00-.11.27c.357.698.765 1.362 1.227 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </span>
                  )}
                </span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${activity.user.tagStyle}`}>
                  {activity.user.tag}
                </span>
                <span className="text-xs text-zinc-500 ml-auto sm:ml-0">
                  {activity.time}
                </span>
              </div>

              <div className="text-sm text-zinc-400 mb-2">
                <span className="text-zinc-500">{activity.actionType}</span>{" "}
                <a
                  href={activity.targetHref}
                  className="font-medium text-violet-400 hover:text-violet-300 transition-colors hover:underline"
                >
                  {activity.targetTitle}
                </a>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400 border border-zinc-800/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleUpvote(activity.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md transition-all duration-200 border ${
                    activity.hasUpvoted
                      ? "bg-violet-500/10 border-violet-500/40 text-violet-400"
                      : "bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${activity.hasUpvoted ? "scale-110 fill-violet-400" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 15.75l7.5-7.5 7.5 7.5"
                    />
                  </svg>
                  <span>{activity.upvotes}</span>
                </button>

                <button className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-900/40 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-all duration-200">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785 11.24 11.24 0 003.133-1.008c.502-.185 1.053-.242 1.587-.14 1.053.2 2.144.318 3.251.318z"
                    />
                  </svg>
                  <span>{activity.replies}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
