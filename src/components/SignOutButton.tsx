"use client";

import { handleSignOut } from "@/app/actions";

export default function SignOutButton({ initials }: { initials: string }) {
  return (
    <form action={handleSignOut}>
      <button
        type="submit"
        className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-zinc-800 hover:ring-violet-500 transition-all cursor-pointer bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm"
        title="Sign out"
      >
        {initials}
      </button>
    </form>
  );
}
