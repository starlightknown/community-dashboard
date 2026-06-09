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
      <nav className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="ZENCODER" className="h-6 w-auto" />
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase hidden sm:block">
            Community Dashboard
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-[13px] font-medium text-white">{user.name || user.email}</div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                {userMember?.tier || "Lurker"}
              </div>
            </div>
            <button
              onClick={() => setProfileOpen(true)}
              className="relative h-9 w-9 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center text-white font-bold text-[13px] hover:border-[#FF6B2B]/50 transition-all cursor-pointer overflow-hidden group"
              title="Open profile"
            >
              <div className="absolute inset-0 bg-[#FF6B2B] opacity-0 group-hover:opacity-10 transition-opacity" />
              {initials}
            </button>
          </div>
        )}
      </nav>

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
