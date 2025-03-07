import React from "react";
import { messageType } from "@/types/types";
import Image from "next/image";
import { PiCrownSimpleFill } from "react-icons/pi";
import Link from "next/link";

function Message({ message }: { message: messageType }) {
  return (
    <div className="p-2">
      <div className="">
        <Link
          href={`/profile/${message.userId}`}
          className="flex items-center gap-2"
        >
          <Image
            src={message.userImage}
            alt="user-image"
            width={30}
            height={30}
            className="rounded-full h-5 w-5 hover:opacity-50 transition"
          />
          <div className="flex items-center gap-1">
            <p className="font-bold text-sm hover:text-white/50 transition">
              @{message.userName}
            </p>

            {message.userPremium && (
              <PiCrownSimpleFill className="text-yellow-400" />
            )}
          </div>
        </Link>
      </div>
      <p className="mt-2">{message.message}</p>
    </div>
  );
}

export default Message;
