-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_topics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "display_title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "topics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_topics" ("created_at", "description", "display_title", "id", "image_url", "title", "updated_at", "user_id") SELECT "created_at", "description", "display_title", "id", "image_url", "title", "updated_at", "user_id" FROM "topics";
DROP TABLE "topics";
ALTER TABLE "new_topics" RENAME TO "topics";
CREATE UNIQUE INDEX "topics_title_key" ON "topics"("title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
