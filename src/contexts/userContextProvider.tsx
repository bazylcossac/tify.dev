"use client";

import { createPost, revalidateHomePage } from "@/actions/actions";
import { revalidatePath } from "next/cache";
import {
  createContext,
  useContext,
  useOptimistic,
  startTransition,
} from "react";

const UserContext = createContext<ContextTypes | null>(null);

export default function UserContextProvider({
  children,
  data,
  error,
  fetchNextPage,
}: {
  children: React.ReactNode;
  data: any;
  error: any;
  fetchNextPage: () => void;
}) {
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    data,
    (posts, newPost) => ({
      pageParams: posts.pageParams,
      pages: posts.pages.map((page, index) => {
        if (index === 0) {
          return {
            ...page,
            posts: [newPost, ...page.posts], // Dodaj nowy post na początek pierwszej strony
          };
        }
        return page;
      }),
    })
  );

  function tempRandomId() {
    return Math.floor(Math.random() * 100000);
  }

  async function addPostOptimistic(postText, fileType, mediaUrl) {
    startTransition(() => {
      addOptimisticPost({
        postText,
        fileType,
        mediaUrl,
        postId: tempRandomId(),
      });
    });
    await createPost(postText, fileType, mediaUrl);
  }

  return (
    <UserContext.Provider
      value={{ data: optimisticPosts, error, fetchNextPage, addPostOptimistic }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("Please, use this hook in UserContextProvider");
  }
  return context;
}
