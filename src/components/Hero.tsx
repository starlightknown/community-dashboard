"use client";

import React from "react";

export default function Hero() {
  const metrics = [
    {
      label: "Active Members",
      value: "1,248 online",
      icon: (
        <svg
          className="h-5 w-5 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      highlight: true,
    },
    {
      label: "Total Projects",
      value: "342 shared",
      icon: (
        <svg
          className="h-5 w-5 text-violet-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Open Q&As",
      value: "18 active",
      icon: (
        <svg
          className="h-5 w-5 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Your Community Rank",
      value: "#42 (Pro Builder)",
      icon: (
        <svg
          className="h-5 w-5 text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
      accentBorder: true,
    },
  ];

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 border-b border-zinc-900/50 bg-black">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 h-[250px] w-[450px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center sm:text-left mb-10 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Welcome to the{" "}
            <span className="bg-gradient-to-r from-violet-400 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
              Zencoder Community
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400">
            Where builders share, learn, and grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`p-5 rounded-xl transition-all duration-300 ${
                metric.accentBorder
                  ? "bg-zinc-900/40 backdrop-blur-md border border-violet-500/20 shadow-[0_0_15px_-3px_rgba(139,92,246,0.1)] hover:border-violet-500/40"
                  : "bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-700/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-500">
                  {metric.label}
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 border border-zinc-800/80">
                  {metric.icon}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {metric.highlight && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
                <span className="text-xl font-bold text-white tracking-tight">
                  {metric.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
