import React from "react";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import ActionCards from "../../components/ActionCards";
import ActivityFeed from "../../components/ActivityFeed";
import Leaderboard from "../../components/Leaderboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-white">
      <Header />
      
      <main className="flex-1 pb-16">
        <Hero />
        
        <ActionCards />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ActivityFeed />
            </div>
            
            <div className="lg:col-span-1">
              <Leaderboard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
