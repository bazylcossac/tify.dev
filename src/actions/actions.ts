"use server";

import { auth, signIn, signOut } from "@/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { redirect } from "next/navigation";
import {
  ACCEPTED_BACKGROUND_FILES,
  ACCEPTED_FILES,
  MAX_FILE_SIZE,
} from "@/lib/constants";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { commentSchema, postSchema, userSchema } from "@/lib/zod-schemas";

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
      userId: session.userId,
    },
  });

  const signedUrl = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return { url: signedUrl };
}

export async function createPost(
  postText: string,
  type?: string | undefined,
  mediaUrl?: string | undefined
) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  const validatedData = postSchema.safeParse({ mediaUrl, postText, type });

  if (!validatedData.success) {
    throw new Error("Failed to validate post data");
  }
  const post = await prisma.post.create({
    data: {
      userId: session.userId,
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
  revalidatePath("/home", "page");
  return post;
}

export async function createCommentToPost(
  commentText: string,
  postId: string,
  mediaUrl?: string | undefined,
  type?: string
) {
  const session = await auth();

  const userId = session?.userId;
  if (!session?.user) {
    redirect("/");
  }
  const { image, name, email } = session?.user;

  const userValidation = userSchema.safeParse({ name, email, image, userId });
  if (!userValidation.success) {
    return {
      message: "Failed to validate user",
    };
  }
  if (!userValidation.data.userId) {
    redirect("/");
  }

  const commentDataValidation = commentSchema.safeParse({
    commentText,
    postId,
    type,
    mediaUrl,
  });

  if (!commentDataValidation.success) {
    return {
      message: "Failed to validate comment data",
    };
  }

  await prisma.comments.create({
    data: {
      userId: userValidation.data.userId,
      userName: userValidation.data.name,
      userEmail: userValidation.data.email,
      userImage: userValidation.data.image,
      commentText: commentDataValidation.data.commentText,
      postId: commentDataValidation.data.postId,
      commentMediaUrl: commentDataValidation.data.mediaUrl || "",
      commentMediaType: commentDataValidation.data.type || "",
      media: {
        create: [
          {
            type: type || "",
            url: mediaUrl || "",
            postId: postId,
          },
        ],
      },
    },
  });

  revalidateTag("posts");
}

export async function getUserById(userId: string | string[]) {
  let id;
  if (typeof userId === "string") {
    id = userId;
  } else {
    id = userId[0];
  }
  return await prisma.user.findFirst({
    where: {
      id: id,
    },
    include: {
      followed: true,
      follower: true,
    },
  });
}
export async function getUserFollowers(userId: string) {
  return await prisma.user.findFirst({
    where: { id: userId },
    include: {
      followed: true,
      follower: true,
    },
  });
}

export async function followUser(userYouWantToFollow: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  const isUserFollowing = await prisma.followers.findFirst({
    where: {
      followerId: session.userId,
      followedId: userYouWantToFollow,
    },
  });

  if (isUserFollowing) {
    await prisma.followers.deleteMany({
      where: {
        followerId: session.userId,
        followedId: userYouWantToFollow,
      },
    });
  } else {
    await prisma.followers.create({
      data: {
        followerId: session.userId,
        followedId: userYouWantToFollow,
      },
    });
  }
  revalidatePath(`/profile/${userYouWantToFollow}`, "page");
}

export async function likePost(postId: string) {
  const session = await auth();

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
  revalidatePath("/home", "page");
}

export async function getPostComments(postId: string) {
  try {
    const comments = await prisma.comments.findMany({
      where: { postId },
      orderBy: {
        createdAt: "desc",
      },
    });
    return comments;
  } catch {
    throw "Failed to find comments";
  }
}

export async function getPostLikesById(postId: string) {
  if (!postId) {
    throw new Error("No id provided");
  }
  return await prisma.post.findUnique({
    where: { postId },
    select: {
      likes: true,
      LikeUsers: true,
    },
  });
}

export async function getUserPosts({ pageParam }: { pageParam: number }) {
  const session = await auth();

  const pageSize = 10;
  const posts = await prisma.post.findMany({
    where: {
      userId: session?.userId,
    },
    take: pageSize,
    skip: pageParam * pageSize,
    include: {
      media: true,
      User: true,
      LikeUsers: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  console.log(posts);
  const totalPosts = await prisma.post.count();

  const hasMore = (pageParam + 1) * pageSize < totalPosts;

  return {
    posts,
    nextCursor: hasMore ? pageParam + 1 : null,
  };
}

export async function getPostById(postId: string) {
  return await prisma.post.findUnique({
    where: { postId: postId },
    include: { User: true, LikeUsers: true, media: true },
  });
}

export async function updateUserBackgroundImage(
  bgUrl: string,
  bgSize: number,
  bgType: string,
  userId: string
) {
  const session = await auth();
  if (session?.userId !== userId) {
    throw new Error("Invalid user");
  }

  if (bgSize > MAX_FILE_SIZE) {
    return {
      message: "File is too big",
    };
  }

  if (!ACCEPTED_BACKGROUND_FILES.includes(bgType)) {
    return {
      message: "Invalid file type",
    };
  }
  /// add url validation
  await prisma.user.update({
    where: { id: userId },
    data: {
      backgroundImage: bgUrl,
    },
  });
  revalidatePath("/profle", "page");
}
