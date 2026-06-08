"use client";

import React, { useState } from "react";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    tag: string;
    tagStyle: string;
    avatarGradient: string;
    initials: string;
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

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "1",
      user: {
        name: "Sarah Connor",
        tag: "Core Contributor",
        tagStyle: "text-violet-400 bg-violet-500/10 border-violet-500/20",
        avatarGradient: "from-violet-500 to-fuchsia-500",
        initials: "SC",
      },
      actionType: "shared a new repo",
      targetTitle: "zencoder-rag-pipeline",
      targetHref: "#",
      time: "12m ago",
      tags: ["AI", "RAG", "TypeScript"],
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
      },
      actionType: "answered a question",
      targetTitle: "Deploying Next.js with custom postcss config on Edge servers",
      targetHref: "#",
      time: "2h ago",
      tags: ["NextJS", "Edge", "Deployment"],
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
      },
      actionType: "started a conversation",
      targetTitle: "My onboarding experience with Zencoder was absolutely flawless!",
      targetHref: "#",
      time: "5h ago",
      tags: ["Onboarding", "UX"],
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
                <span className="text-sm font-semibold text-white">
                  {activity.user.name}
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
