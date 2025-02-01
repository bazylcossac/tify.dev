-- CreateTable
CREATE TABLE "LikeUsers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "likedPostUserId" TEXT NOT NULL,
    "likedPostId" TEXT,
    CONSTRAINT "LikeUsers_likedPostUserId_fkey" FOREIGN KEY ("likedPostUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LikeUsers_likedPostId_fkey" FOREIGN KEY ("likedPostId") REFERENCES "Post" ("postId") ON DELETE SET NULL ON UPDATE CASCADE
);
