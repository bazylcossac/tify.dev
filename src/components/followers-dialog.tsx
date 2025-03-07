import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserContext } from "@/contexts/userContextProvider";
import { GetUniqueUserDataType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

import Image from "next/image";
import Link from "next/link";

import { PiCrownSimpleFill } from "react-icons/pi";

export function FollowersDialog({
  user,
  type,
  children,
}: {
  user: GetUniqueUserDataType;
  type: "followed" | "follower";
  children: React.ReactNode;
}) {
  const { getUserFollowsData } = useUserContext();
  console.log("user");
  console.log(user[type]);

  const { data, error } = useQuery({
    queryKey: [user[type]],
    queryFn: () => getUserFollowsData(user[type], type),
    retry: 0,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
  });
  console.log(data);

  if (error) {
    return <p>error</p>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-4/5 md:max-w-[425px] md:max-h-[500px] overflow-y-auto bg-[#0D0D0D] border-none">
        <DialogHeader>
          <DialogTitle>
            {type === "follower" ? "Following" : "Followed"}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {data?.map((user) => (
          <div key={user?.id}>
            <Link
              href={`/profile/${user?.id}`}
              className="flex flex-row items-center gap-2"
            >
              <Image
                src={user?.image}
                alt="user image"
                width={50}
                height={50}
                className="size-8 rounded-full"
              />
              <p className="text-sm font-bold">{user?.name}</p>
              {user.premium && (
                <PiCrownSimpleFill className="text-yellow-400" />
              )}
            </Link>
          </div>
        ))}

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
