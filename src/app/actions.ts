"use server";

import { redirect } from "next/navigation";

export async function handleDiscordSignIn() {
  redirect("/auth/signin");
}
