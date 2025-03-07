"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pusherClient } from "@/lib/pusher";
import { sendMessage } from "@/actions/actions";

import React, { useEffect, useState } from "react";

function Page() {
  const [userMessage, setUserMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<string[] | []>([]);

  useEffect(() => {
    pusherClient.subscribe("chat");

    pusherClient.bind("message", (data) => {
      console.log(data);
    });
  }, []);

  return (
    <div className="max-w-[1200px] h-full  relative">
      <div></div>
      <div className="flex justify-center">
        <form
          className="flex flex-row items-center gap-2 absolute bottom-5 w-11/12"
          action={sendMessage}
        >
          <Input
            placeholder="Say something nice!"
            value={userMessage}
            name="userMessage"
            onChange={(e) => setUserMessage(e.target.value)}
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
