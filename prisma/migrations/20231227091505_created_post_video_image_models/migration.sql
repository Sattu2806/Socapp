-- CreateEnum
CREATE TYPE "TypePost" AS ENUM ('IMAGE', 'VIDEO', 'POST');

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL DEFAULT concat('post_', replace(cast(gen_random_uuid() as text), '-', '')),
    "content" TEXT,
    "type" "TypePost" NOT NULL,
    "tags" TEXT[],
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL DEFAULT concat('image_', replace(cast(gen_random_uuid() as text), '-', '')),
    "url" TEXT NOT NULL,
    "description" TEXT,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL DEFAULT concat('video_', replace(cast(gen_random_uuid() as text), '-', '')),
    "url" TEXT NOT NULL,
    "description" TEXT,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
