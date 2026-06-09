"use client";

import React, { useState } from "react";
import type { Session } from "next-auth";
import ProfileModal from "./ProfileModal";

interface UserMember {
  id: string;
  username: string;
  totalPoints: number;
  weeklyPoints: number;
  tier: string;
  streakDays: number;
  streakActive: boolean;
  redditHandle?: string | null;
  xHandle?: string | null;
}

interface HeaderProps {
  user?: Session["user"] & { id?: string };
  userMember?: UserMember | null;
}

export default function Header({ user, userMember }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : (user?.email?.[0] || "?").toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <svg
              className="h-8 w-8 text-orange-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-white">Zencoder</span>
            <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400 border border-orange-500/20">
              Community
            </span>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/30 border border-zinc-800 text-zinc-400 text-xs font-medium">
                {user.name || user.email}
              </div>
              <button
                onClick={() => setProfileOpen(true)}
                className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-zinc-800 hover:ring-orange-500 transition-all cursor-pointer bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-sm"
                title="Open profile"
              >
                {initials}
              </button>
            </div>
          )}
        </div>
      </header>

      {user && (
        <ProfileModal
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          userId={(user as any).id || ""}
          userName={user.name || user.email || undefined}
          userInitials={initials}
          initialMember={userMember}
        />
      )}
    </>
  );
}
