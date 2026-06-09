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

  useEffect(() => {
    if (isOpen && userId) {
      fetch(`/api/points/member?id=${userId}`)
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data && !data.error) setMember(data);
        })
        .catch(() => {});
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (!isOpen) {
      setRedditMsg("");
      setXMsg("");
      setRedditHandle("");
      setXHandle("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const tier = member?.tier || "LURKER";
  const tierLabel = TIER_LABELS[tier] || tier;
  const tierColor = TIER_COLORS[tier] || TIER_COLORS.LURKER;
  const totalPoints = member?.totalPoints ?? 0;
  const weeklyPoints = member?.weeklyPoints ?? 0;
  const maxPts = TIER_NEXT_MAX[tier] ?? 100;
  const progressPct = tier === "CHAMPION" ? 100 : Math.min(100, Math.round((totalPoints / maxPts) * 100));

  const redditLinked = member?.socialLinks?.find((l) => l.platform === "REDDIT") || (member?.redditHandle ? { handle: member.redditHandle } : null);
  const xLinked = member?.socialLinks?.find((l) => l.platform === "X") || (member?.xHandle ? { handle: member.xHandle } : null);

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
        setMsg(`✅ Linked! +${data.pointsAwarded} pts awarded`);
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/5 border-b border-zinc-800/60 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-orange-500/20">
                {userInitials}
              </div>
              <div>
                <div className="text-white font-bold text-base">{userName || member?.username || "Community Member"}</div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${tierColor}`}>
                  {tierLabel}
                  {member?.streakActive && <span className="ml-1">🔥</span>}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-1">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/60 p-3 text-center">
              <div className="text-2xl font-bold text-white">{totalPoints.toLocaleString()}</div>
              <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">Total Points</div>
            </div>
            <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/60 p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">{weeklyPoints.toLocaleString()}</div>
              <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">This Week</div>
            </div>
          </div>

          {tier !== "CHAMPION" && (
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-zinc-400">Progress to next rank</span>
                <span className="text-zinc-300">{progressPct}%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          <div className="border-t border-zinc-800/60 pt-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Link Social Accounts</h3>
            <p className="text-xs text-zinc-500 mb-3">Earn 75 bonus points for each linked account</p>

            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className="h-4 w-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">Reddit</span>
                  {redditLinked && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      u/{redditLinked.handle}
                    </span>
                  )}
                </div>
                {!redditLinked ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="u/your-username"
                      value={redditHandle}
                      onChange={(e) => setRedditHandle(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                    />
                    <button
                      onClick={() => linkSocial("REDDIT", redditHandle, setLinkingReddit, setRedditMsg)}
                      disabled={linkingReddit}
                      className="px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {linkingReddit ? "..." : "Link"}
                    </button>
                  </div>
                ) : null}
                {redditMsg && <p className={`text-xs mt-1 ${redditMsg.startsWith("✅") ? "text-emerald-400" : "text-red-400"}`}>{redditMsg}</p>}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <svg className="h-4 w-4 text-zinc-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">X / Twitter</span>
                  {xLinked && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      @{xLinked.handle}
                    </span>
                  )}
                </div>
                {!xLinked ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="@your-handle"
                      value={xHandle}
                      onChange={(e) => setXHandle(e.target.value)}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50"
                    />
                    <button
                      onClick={() => linkSocial("X", xHandle, setLinkingX, setXMsg)}
                      disabled={linkingX}
                      className="px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {linkingX ? "..." : "Link"}
                    </button>
                  </div>
                ) : null}
                {xMsg && <p className={`text-xs mt-1 ${xMsg.startsWith("✅") ? "text-emerald-400" : "text-red-400"}`}>{xMsg}</p>}
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800/60 pt-4">
            <form action={handleSignOut}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-400 hover:text-white text-sm font-semibold transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
