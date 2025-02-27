import { Button } from "@/components/ui/button";
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
import { useQuery } from "@tanstack/react-query";

import Image from "next/image";
import Link from "next/link";

export function FollowersDialog({
  user,
  type,
  children,
}: {
  user: any;
  type: "followed" | "follower";
  children: React.ReactNode;
}) {
  const { getUserFollowsData } = useUserContext();

  const { data, isLoading, error } = useQuery({
    queryKey: [type],
    queryFn: () => getUserFollowsData(user[type], type),
    retry: 0,
    staleTime: 0,
    gcTime: 0,
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
        {/* CONTENT */}

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
            </Link>
          </div>
        ))}

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
