import React from "react";
import { messageType } from "@/types/types";
import Image from "next/image";
import { PiCrownSimpleFill } from "react-icons/pi";
import Link from "next/link";
import formatText from "@/lib/formatText";

import { cn } from "@/lib/utils";

function Message({ message }: { message: messageType }) {
  console.log(message);
  return (
    <div className="p-2">
      <div className=" ">
        <Link
          href={`/profile/${message.userId}`}
          className="inline-flex items-center gap-2 "
        >
          <Image
            src={message.userImage}
            alt="user-image"
            width={30}
            height={30}
            className="rounded-full h-5 w-5 hover:opacity-50 transition"
          />
          <div className="flex items-center gap-1">
            <p
              className={cn(
                "font-bold text-sm hover:text-white/50 transition ",
                message?.color || "text-gray-500"
              )}
            >
              @{message.userName}
            </p>

            {message.userPremium && (
              <PiCrownSimpleFill className="text-yellow-400" />
            )}
            <p className="text-xs">
              {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </Link>
      </div>
      <div className="mt-2">{formatText(message.message)}</div>
    </div>
  );
}

export default Message;
