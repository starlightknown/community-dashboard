"use client";

import React, { useState } from "react";
import type { Session } from "next-auth";
import SignOutButton from "./SignOutButton";

interface HeaderProps {
  user?: Session["user"];
}

export default function Header({ user }: HeaderProps) {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Discussions", href: "#" },
    { name: "Projects", href: "#" },
    { name: "Leaderboard", href: "#" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
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
            <span className="text-xl font-bold tracking-tight text-white">
              Zencoder
            </span>
            <span className="rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400 border border-orange-500/20">
              Community
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.href === "#") {
                    e.preventDefault();
                  }
                  setActiveTab(link.name);
                }}
                className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                  activeTab === link.name
                    ? "text-white bg-zinc-900/60"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                }`}
              >
                {link.name}
                {activeTab === link.name && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600" />
                )}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-4 w-4 text-zinc-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search community..."
              className="w-full rounded-lg bg-zinc-900/50 border border-zinc-800/80 py-1.5 pl-9 pr-12 text-sm text-zinc-300 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <kbd className="hidden sm:inline-block rounded border border-zinc-800 bg-zinc-950 px-1.5 text-[10px] font-medium text-zinc-500">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/30 border border-zinc-800 text-zinc-400 text-xs font-medium">
                  {user.name || user.email}
                </div>
                <SignOutButton
                  initials={
                    user.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || (user.email?.[0] || "?").toUpperCase()
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
