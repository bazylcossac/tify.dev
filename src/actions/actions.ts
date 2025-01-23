"use server";

import { auth, signIn } from "@/auth";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { redirect } from "next/navigation";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});
export async function GetPost(formData: FormData) {
  const formDataObject = Object.fromEntries(formData.entries());
  console.log(formDataObject);
}

export async function LogInWithProvider(provider: "google" | "github") {
  await signIn(provider);
}

export async function getSignedURL() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: "test-file",
  });

  const signedUrl = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });
  return { url: signedUrl };
}
