import React from "react";
import { messageType } from "@/types/types";
import Image from "next/image";
import { PiCrownSimpleFill } from "react-icons/pi";

function Message({ message }: { message: messageType }) {
  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <Image
          src={message.userImage}
          alt="user-image"
          width={30}
          height={30}
          className="rounded-full h-5 w-5"
        />
        <div className="flex items-center gap-1">
          <p className="font-bold text-sm">@{message.userName}</p>

          {message.userPremium && (
            <PiCrownSimpleFill className="text-yellow-400" />
          )}
        </div>
      </div>
      <p className="mt-2">{message.message}</p>
    </div>
  );
}

export default Message;
