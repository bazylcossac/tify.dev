-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "backgroundImage" TEXT,
    "premium" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("backgroundImage", "email", "id", "image", "name", "premium", "username") SELECT "backgroundImage", "email", "id", "image", "name", "premium", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
