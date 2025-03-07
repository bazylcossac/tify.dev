"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pusherClient } from "@/lib/pusher";
import { sendMessage } from "@/actions/actions";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { messageType } from "@/types/types";
import Message from "@/components/message-component";

function Page() {
  const session = useSession();
  if (session.status === "unauthenticated") {
    redirect("/");
  }
  const [userMessage, setUserMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<messageType[] | []>([]);

  useEffect(() => {
    pusherClient.subscribe("chat");

    pusherClient.bind("message", (data) => {
      setAllMessages((prev) => [...prev, data.data]);
    });
    return () => {
      pusherClient.unsubscribe("chat");
    };
  }, []);
  console.log(allMessages);
  const sendMessageAction = async (formData: FormData) => {
    
    const formatedData = Object.fromEntries(formData);
    /// validation
    const message = formatedData.userMessage as string;
    const messageObject = {
      userName: session?.data?.user?.name,
      userImage: session?.data?.user?.image,
      userPremium: session.data?.premiumStatus,
      message: message,
    };
    await sendMessage(messageObject);
    setUserMessage("");
  };

  return (
    <div className="max-w-[1200px] h-full ">
      <div>
        <ul>
          {allMessages.map((message: messageType, i) => {
            return <Message key={i} message={message} />;
          })}
        </ul>
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
