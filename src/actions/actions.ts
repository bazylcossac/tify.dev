"use server";

import { auth, signIn, signOut } from "@/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { redirect } from "next/navigation";
import { ACCEPTED_FILES, MAX_FILE_SIZE } from "@/lib/constants";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { postSchema } from "@/lib/zod-schemas";

/// generate random 32bit file name
const generateFileName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

/// create s3 client
const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export async function LogInWithProvider(provider: "google" | "github") {
  await signIn(provider, { redirectTo: "/home", redirect: true });
}
export async function logOut() {
  await signOut({ redirectTo: "/", redirect: true });
}

export async function getSignedURL(
  type: string,
  size: number,
  checksum: string
) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }
  const user = await getUserByEmail(session.user.email);

  if (!ACCEPTED_FILES.includes(type)) {
    return {
      message: "Invalid file type",
    };
  }
  if (size > MAX_FILE_SIZE) {
    return {
      message: "File is too large",
    };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
    Metadata: {
      userId: user!.email,
    },
  });

  const signedUrl = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return { url: signedUrl };
}

export async function createPost(
  postText: string,
  type?: string,
  mediaUrl?: string
) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
    select: {
      id: true,
    },
  });
  if (!user) {
    return {
      message: "Failed to find a user",
    };
  }

  const validatedData = postSchema.safeParse({ mediaUrl, postText, type });

  if (!validatedData.success) {
    return {
      message: "Failed to validate post data",
    };
  }
  await prisma.post.create({
    data: {
      userId: user.id,
      postText: String(validatedData.data.postText),
      likes: 0,
      stars: 0,
      media: {
        create: [
          {
            type: validatedData.data.type || "",
            url: validatedData.data.mediaUrl || "",
          },
        ],
      },
    },
  });
  revalidateTag("posts");
  revalidatePath("/home", "page"); // Odświeżenie strony na serwerze
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

export async function likePost(postId: string) {
  const session = await auth();
  console.log(session);
  if (!session?.user?.email) {
    redirect("/");
  }

  /// Chcec if user has already liked that post
  const isUserLiked = await prisma.likeUsers.findFirst({
    where: {
      likedPostUserId: session.userId,
      likedPostId: postId,
    },
  });

  if (isUserLiked) {
    /// Decrement likes in this post
    await prisma.post.update({
      where: {
        postId: postId,
      },
      data: { likes: { decrement: 1 } },
    });
    /// Delete user from likes on this post
    await prisma.likeUsers.deleteMany({
      where: { likedPostUserId: session.userId, likedPostId: postId },
    });

    return;
  } else {
    /// Increment likes in this post
    await prisma.post.update({
      where: {
        postId: postId,
      },
      data: { likes: { increment: 1 } },
    });

    /// Add users to likes in this post
    await prisma.likeUsers.create({
      data: {
        likedPostUserId: session.userId,
        likedPostId: postId,
      },
    });
  }
  revalidateTag("posts");
  revalidatePath("/home", "page");
}
