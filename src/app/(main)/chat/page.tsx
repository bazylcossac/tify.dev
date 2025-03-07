"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pusherClient } from "@/lib/pusher";
import { sendMessage, sendMessageToDB } from "@/actions/actions";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { messageType } from "@/types/types";
import Message from "@/components/message-component";
import { useUserContext } from "@/contexts/userContextProvider";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/loading";

function Page() {
  const session = useSession();
  if (session.status === "unauthenticated") {
    redirect("/");
  }
  const { getNMessages } = useUserContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => await getNMessages(20),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const [userMessage, setUserMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<messageType[] | undefined>([]);
  const lastElement = useRef(null);
  console.log(allMessages);
  useEffect(() => {
    setAllMessages(data?.reverse());
  }, [data]);

  useEffect(() => {
    pusherClient.subscribe("chat");

    pusherClient.bind("message", (data) => {
      console.log(data);
      setAllMessages((prev) => [...prev, data.data]);
    });
    return () => {
      pusherClient.unsubscribe("chat");
    };
  }, []);

  useEffect(() => {
    lastElement?.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const sendMessageAction = async (formData: FormData) => {
    const formatedData = Object.fromEntries(formData);
    /// validation
    const message = formatedData.userMessage as string;
    const messageObject = {
      userId: session.data?.userId,
      userName: session.data?.user?.name,
      userImage: session.data?.user?.image,
      userPremium: session.data?.premiumStatus,
      message: message,
      createdAt: Date.now(),
    };
    await sendMessage(messageObject);
    await sendMessageToDB(messageObject);
    setUserMessage("");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-[1200px] h-full ">
      <div>
        <ul className="mt-24">
          {!error &&
            allMessages?.map((message: messageType, i) => {
              return <Message key={i} message={message} />;
            })}
          <div ref={lastElement} className="h-[5px]"></div>
        </ul>
        {error && <div>Failed to load messages</div>}
      </div>
      <div className="flex justify-center">
        <form
          className="flex flex-row items-center gap-2 fixed bottom-5 w-3/4 md:w-7/12"
          action={sendMessageAction}
        >
          <Input
            placeholder="Say something nice!"
            value={userMessage}
            name="userMessage"
            onChange={(e) => setUserMessage(e.target.value)}
            className="bg-black"
          />
          <Button
            className="bg-blue-500"
            disabled={userMessage.trim().length === 0}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Page;
