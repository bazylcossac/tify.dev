"use server";

import { auth, signIn } from "@/auth";
export async function GetPost(formData: FormData) {
  const formDataObject = Object.fromEntries(formData.entries());
  console.log(formDataObject);
}

export async function LogInWithProvider(provider: "google" | "github") {
  await signIn(provider);
}
