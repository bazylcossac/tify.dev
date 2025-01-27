import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/db";
import { calculatePostTime } from "@/lib/utils";

import Image from "next/image";
import React from "react";

// overflow-y-auto no-scrollbar
async function Page() {
  const posts = await prisma.post.findMany({
    include: {
      media: true,
      user: true,
    },
  });

  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar">
      <ul>
        {posts.map((post) => (
          <div
            key={post.postId}
            className="flexf flex-col mx-4 border-b border-white/30 py-4 "
          >
            {post ? (
              <div className="flex flex-row items-center justify-between">
                <div className=" flex items-center gap-2 my-4">
                  <Image
                    src={post.user.image}
                    width={30}
                    height={30}
                    alt="user image"
                    className="rounded-full w-6 h-6"
                  />
                  <div className="flex flex-row items-center">
                    <p className="mt-auto text-sm font-semibold ">
                      @{post.user.name}
                    </p>
                    <p className="text-[11px] text-white/30 mx-2">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-white/60 font-semibold">
                    {calculatePostTime(post.createdAt)} minutes ago
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 my-4">
                <Skeleton className="h-6 w-6 rounded-full bg-[#141414] animate-pulse" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[90px] bg-[#141414] animate-pulse" />
                </div>
              </div>
            )}
            {post.postText && (
              <p className="text-sm font-semibold my-2">{post.postText}</p>
            )}
            <div className="justify-center flex">
              {post.media[0].type.startsWith("image") ? (
                <Image
                  src={post.media[0].url}
                  width={800} // Optymalna szerokość dla Twojego designu
                  height={600}
                  quality={100}
                  alt="post image"
                  className="rounded-lg border border-white/30 w-full max-h-[600px] object-contain"
                />
              ) : (
                <video
                  src={post.media[0].url}
                  width={800} // Optymalna szerokość dla Twojego designu
                  height={600}
                  controls
                  className="rounded-lg border border-white/30 w-full max-h-[600px] object-contain"
                />
              )}
            </div>
          </div>

          /// obsluzyc generowanie video jezeli typ to video
        ))}
      </ul>
      {/* <p className="">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      v
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      v
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>{" "}
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p>
      <p className="my-4">
        {" "}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aperiam
        exercitationem a dolore illo reprehenderit eligendi magnam. Voluptatibus
        amet fuga laborum sequi sit vero quibusdam placeat maiores nihil? Autem,
        animi!
      </p> */}
    </div>
  );
}

export default Page;
