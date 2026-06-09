"use client";

import React, { useState, useEffect } from "react";
import { handleSignOut } from "@/app/actions";

interface SocialLink {
  platform: string;
  handle: string;
  verifiedAt: string;
}

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
  socialLinks?: SocialLink[];
  onboardingIntro?: boolean;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName?: string;
  userInitials: string;
  initialMember?: UserMember | null;
}

const TIER_COLORS: Record<string, string> = {
  CHAMPION: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  CONTRIBUTOR: "text-orange-300 border-orange-300/30 bg-orange-300/10",
  BUILDER: "text-amber-400 border-amber-400/30 bg-amber-400/10",
  MEMBER: "text-zinc-300 border-zinc-300/30 bg-zinc-300/10",
  LURKER: "text-slate-400 border-slate-400/30 bg-slate-400/10",
};

const TIER_LABELS: Record<string, string> = {
  CHAMPION: "Champion",
  CONTRIBUTOR: "Contributor",
  BUILDER: "Builder",
  MEMBER: "Member",
  LURKER: "Lurker",
};

const TIER_NEXT_MAX: Record<string, number> = {
  LURKER: 100,
  MEMBER: 500,
  BUILDER: 1500,
  CONTRIBUTOR: 4000,
  CHAMPION: 4000,
};

export default function ProfileModal({
  isOpen,
  onClose,
  userId,
  userName,
  userInitials,
  initialMember,
}: ProfileModalProps) {
  const [member, setMember] = useState<UserMember | null>(initialMember ?? null);
  const [redditHandle, setRedditHandle] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [linkingReddit, setLinkingReddit] = useState(false);
  const [linkingX, setLinkingX] = useState(false);
  const [redditMsg, setRedditMsg] = useState("");
  const [xMsg, setXMsg] = useState("");
  const [introMsg, setIntroMsg] = useState("");
  const [claimingIntro, setClaimingIntro] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [mentionUrl, setMentionUrl] = useState("");
  const [mentionPlatform, setMentionPlatform] = useState<"X" | "REDDIT">("X");
  const [submittingMention, setSubmittingMention] = useState(false);
  const [mentionMsg, setMentionMsg] = useState("");
  const [loading, setLoading] = useState(!initialMember);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      fetch(`/api/points/member?id=${userId}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data && !data.error) setMember(data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (!isOpen) {
      setRedditMsg("");
      setXMsg("");
      setIntroMsg("");
      setSyncMsg("");
      setMentionUrl("");
      setMentionMsg("");
      setRedditHandle("");
      setXHandle("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tier = member?.tier || "LURKER";
  const tierLabel = TIER_LABELS[tier] || tier;
  const totalPoints = member?.totalPoints ?? 0;
  const weeklyPoints = member?.weeklyPoints ?? 0;
  const maxPts = TIER_NEXT_MAX[tier] ?? 100;
  const progressPct = tier === "CHAMPION" ? 100 : Math.min(100, Math.round((totalPoints / maxPts) * 100));

  const redditLinked = member?.socialLinks?.find((l) => l.platform === "REDDIT") || (member?.redditHandle ? { handle: member.redditHandle } : null);
  const xLinked = member?.socialLinks?.find((l) => l.platform === "X") || (member?.xHandle ? { handle: member.xHandle } : null);

  async function submitMention() {
    if (!mentionUrl.trim()) {
      setMentionMsg("Please enter a URL");
      return;
    }
    setSubmittingMention(true);
    setMentionMsg("");
    try {
      const res = await fetch("/api/mentions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: userId, platform: mentionPlatform, postUrl: mentionUrl.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMentionMsg("✅ Submitted! Waiting for verification.");
        setMentionUrl("");
      } else {
        setMentionMsg(`❌ ${data.error}`);
      }
    } catch {
      setMentionMsg("❌ Submission failed");
    } finally {
      setSubmittingMention(false);
    }
  }

  async function claimIntro() {
    setClaimingIntro(true);
    setIntroMsg("");
    try {
      const res = await fetch("/api/points/verify-intro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIntroMsg(`✅ Claimed! +${data.points} pts`);
        const updated = await fetch(`/api/points/member?id=${userId}`).then((r) => r.json());
        if (updated && !updated.error) setMember(updated);
      } else {
        setIntroMsg(`❌ ${data.error}`);
      }
    } catch {
      setIntroMsg("❌ Failed to verify intro");
    } finally {
      setClaimingIntro(false);
    }
  }

  async function syncActivity() {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/points/sync-reactions", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncMsg(`✅ Synced! Found ${data.awardedCount} new items`);
        const updated = await fetch(`/api/points/member?id=${userId}`).then((r) => r.json());
        if (updated && !updated.error) setMember(updated);
      } else {
        setSyncMsg(`❌ ${data.error}`);
      }
    } catch {
      setSyncMsg("❌ Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  async function linkSocial(platform: "REDDIT" | "X", handle: string, setLoading: (v: boolean) => void, setMsg: (v: string) => void) {
    if (!handle.trim()) {
      setMsg("Please enter a handle");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/social/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: userId, platform, handle: handle.trim().replace(/^@/, "") }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(`✅ Linked! +${data.pointsAwarded} pts`);
        const updated = await fetch(`/api/points/member?id=${userId}`).then((r) => r.json());
        if (updated && !updated.error) setMember(updated);
      } else {
        setMsg(`❌ ${data.error}`);
      }
    } catch {
      setMsg("❌ Failed to link account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-8">
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#FF6B2B] uppercase">Member Profile</div>
            <button onClick={onClose} className="text-zinc-600 hover:text-white transition-colors">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#FF6B2B] to-[#FF8B5B] flex items-center justify-center text-black font-bold text-2xl border border-white/10 shadow-lg shadow-[#FF6B2B]/20">
              {userInitials}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white italic tracking-tight mb-1">{userName || member?.username || "Builder"}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#FF6B2B] uppercase tracking-widest bg-[#FF6B2B]/10 px-2 py-0.5 rounded border border-[#FF6B2B]/20">
                  {tierLabel}
                </span>
                {member?.streakActive && (
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    🔥 {member.streakDays} Day Streak
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 flex-1 overflow-y-auto min-h-[300px] flex flex-col justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-2 border-[#FF6B2B]/20 border-t-[#FF6B2B] rounded-full animate-spin" />
              <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Syncing Data...</div>
            </div>
          ) : !member ? (
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 border border-red-500/20 mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-sm font-bold text-white italic">Member profile not initialized</div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                Interact with the Discord server to activate your profile points tracking.
              </p>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Total Points</div>
                    <div className="text-2xl font-bold text-white tabular-nums italic">{totalPoints.toLocaleString()}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Weekly Gain</div>
                    <div className="text-2xl font-bold text-[#FF6B2B] tabular-nums italic">+{weeklyPoints.toLocaleString()}</div>
                  </div>
                </div>
                <button
                  onClick={syncActivity}
                  disabled={syncing}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-zinc-400 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <svg className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {syncing ? "Syncing Discord..." : "Sync Discord Activity"}
                </button>
                {syncMsg && (
                  <p className={`text-[10px] font-bold text-center uppercase tracking-wider ${syncMsg.includes("✅") ? "text-[#3DD68C]" : "text-red-500"}`}>
                    {syncMsg}
                  </p>
                )}
              </div>

              {/* Onboarding */}
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Community Onboarding</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                        member?.onboardingIntro ? "bg-[#3DD68C]/10 border-[#3DD68C]/20 text-[#3DD68C]" : "bg-white/5 border-white/10 text-zinc-500"
                      }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white uppercase tracking-tight">Server Intro</div>
                        <div className="text-[10px] text-zinc-500 font-medium">Post in #introductions</div>
                      </div>
                    </div>
                    {member?.onboardingIntro ? (
                      <span className="text-[10px] font-bold text-[#3DD68C] uppercase tracking-widest bg-[#3DD68C]/10 px-2 py-0.5 rounded">Completed</span>
                    ) : (
                      <button
                        onClick={claimIntro}
                        disabled={claimingIntro}
                        className="px-3 py-1 bg-[#FF6B2B] hover:bg-[#E55A1F] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-50"
                      >
                        {claimingIntro ? "..." : "Claim"}
                      </button>
                    )}
                  </div>
                  {introMsg && (
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${introMsg.includes("✅") ? "text-[#3DD68C]" : "text-red-500"}`}>
                      {introMsg}
                    </p>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-6">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Verification Status</div>
                
                {/* Reddit */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-tight">Reddit</span>
                      {redditLinked && <span className="text-[10px] font-bold text-[#3DD68C] uppercase">Verified</span>}
                    </div>
                    {redditLinked && <span className="text-xs text-zinc-500 italic">u/{redditLinked.handle}</span>}
                  </div>
                  {!redditLinked && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="u/username"
                        value={redditHandle}
                        onChange={(e) => setRedditHandle(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF6B2B]/50"
                      />
                      <button
                        onClick={() => linkSocial("REDDIT", redditHandle, setLinkingReddit, setRedditMsg)}
                        disabled={linkingReddit}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-50"
                      >
                        {linkingReddit ? "..." : "Link"}
                      </button>
                    </div>
                  )}
                  {redditMsg && <p className={`text-[10px] font-bold uppercase tracking-wider ${redditMsg.includes("✅") ? "text-[#3DD68C]" : "text-red-500"}`}>{redditMsg}</p>}
                </div>

                {/* X */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-tight">X / Twitter</span>
                      {xLinked && <span className="text-[10px] font-bold text-[#3DD68C] uppercase">Verified</span>}
                    </div>
                    {xLinked && <span className="text-xs text-zinc-500 italic">@{xLinked.handle}</span>}
                  </div>
                  {!xLinked && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="@handle"
                        value={xHandle}
                        onChange={(e) => setXHandle(e.target.value)}
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF6B2B]/50"
                      />
                      <button
                        onClick={() => linkSocial("X", xHandle, setLinkingX, setXMsg)}
                        disabled={linkingX}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-50"
                      >
                        {linkingX ? "..." : "Link"}
                      </button>
                    </div>
                  )}
                  {xMsg && <p className={`text-[10px] font-bold uppercase tracking-wider ${xMsg.includes("✅") ? "text-[#3DD68C]" : "text-red-500"}`}>{xMsg}</p>}
                </div>
              </div>

              {/* Public Mentions */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Public Mentions</div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <select
                      value={mentionPlatform}
                      onChange={(e) => setMentionPlatform(e.target.value as "X" | "REDDIT")}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B2B]/50"
                    >
                      <option value="X">X</option>
                      <option value="REDDIT">Reddit</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Paste post URL here"
                      value={mentionUrl}
                      onChange={(e) => setMentionUrl(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#FF6B2B]/50"
                    />
                    <button
                      onClick={submitMention}
                      disabled={submittingMention}
                      className="px-4 py-2 bg-[#FF6B2B] hover:bg-[#E55A1F] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all disabled:opacity-50"
                    >
                      {submittingMention ? "..." : "Submit"}
                    </button>
                  </div>
                  {mentionMsg && (
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${mentionMsg.includes("✅") ? "text-[#3DD68C]" : "text-red-500"}`}>
                      {mentionMsg}
                    </p>
                  )}
                  <p className="text-[9px] text-zinc-600 font-medium uppercase tracking-tight italic">
                    Earn 30 pts per verified mention (Max 1/day per platform).
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
          <form action={handleSignOut}>
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-zinc-500 hover:text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
            >
              Sign Out Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
