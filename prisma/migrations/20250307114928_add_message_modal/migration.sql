-- CreateTable
CREATE TABLE "Message" (
    "messageId" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
