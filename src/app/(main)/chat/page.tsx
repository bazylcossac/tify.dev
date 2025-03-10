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
import { nicknameColors } from "@/lib/constants";
import { toast } from "sonner";

// create nickname color for LiveChat usage
const color = nicknameColors[Math.floor(Math.random() * nicknameColors.length)];

function Page() {
  const session = useSession();
  if (session.status === "unauthenticated") {
    redirect("/");
  }
  const [userMessage, setUserMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<messageType[] | undefined>([]);
  const lastElement = useRef<HTMLDivElement>(null);

  const { getNMessages } = useUserContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => await getNMessages(30),
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    setAllMessages(data?.reverse());
  }, [data]);

  // LiveChat websocket client
  useEffect(() => {

    pusherClient.subscribe("chat");
    pusherClient.bind("message", (data: { data: messageType }) => {
      if (data) {
      }
      setAllMessages((prev) => [
        ...(prev ? [...prev, data.data] : [data.data]),
      ]);
    });
    return () => {
      pusherClient.unsubscribe("chat");
    };
  }, []);

// LiveChat scroll to bottom while new message functionality
  useEffect(() => {
    lastElement?.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const sendMessageAction = async (formData: FormData) => {
    const formatedData = Object.fromEntries(formData);
    if (typeof formatedData.userMessage !== "string") {
      toast("WHOOPSY! You can only send messages here!");
      setUserMessage("");
      return;
    }
    const message = formatedData.userMessage as string;
    const messageObject = {
      userId: session.data?.userId as string,
      userName: session.data?.user?.name as string,
      userImage: session.data?.user?.image as string,
      userPremium: session.data?.premiumStatus as boolean,
      message: message,
      color: color,
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

        <ul className="mb-20 ">
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
          className="flex flex-row items-center gap-2 fixed bottom-5 w-full px-4 md:w-7/12"
          action={sendMessageAction}
        >
          <Input
            placeholder="Say something nice!"
            value={userMessage}
            name="userMessage"
            onChange={(e) => setUserMessage(e.target.value)}
            className="bg-black border border-white/30 h-10 placeholder:text-white/50"
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
