/*
  Warnings:

  - Added the required column `followedId` to the `Followers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Followers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "followerId" TEXT NOT NULL,
    "followedId" TEXT NOT NULL,
    CONSTRAINT "Followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Followers" ("followerId", "id") SELECT "followerId", "id" FROM "Followers";
DROP TABLE "Followers";
ALTER TABLE "new_Followers" RENAME TO "Followers";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
