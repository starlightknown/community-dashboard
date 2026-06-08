"use server";

import { signOut, signIn } from "@/lib/auth";

export async function handleSignOut() {
  await signOut({ redirect: true });
}

export async function handleDiscordSignIn() {
  await signIn("discord");
}
