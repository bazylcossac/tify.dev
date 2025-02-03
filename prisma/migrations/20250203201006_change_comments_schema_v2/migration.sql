/*
  Warnings:

  - Added the required column `userEmail` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userImage` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comments" (
    "commentId" TEXT NOT NULL PRIMARY KEY,
    "commentText" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "commentMediaUrl" TEXT NOT NULL,
    "commentMediaType" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userImage" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("postId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Comments" ("commentId", "commentMediaType", "commentMediaUrl", "commentText", "postId", "userId") SELECT "commentId", "commentMediaType", "commentMediaUrl", "commentText", "postId", "userId" FROM "Comments";
DROP TABLE "Comments";
ALTER TABLE "new_Comments" RENAME TO "Comments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
