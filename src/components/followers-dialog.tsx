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
import Loading from "./loading";
import Image from "next/image";
import Link from "next/link";

export function FollowersDialog({
  user,
  type,
}: {
  user: any;
  type: "followed" | "follower";
}) {
  const { getUserFollowsData } = useUserContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["followers"],
    queryFn: () => getUserFollowsData(user[type]),
  });
  console.log(data);

  if (isLoading) {
    return <Loading />;
  }

  const datatemp = [
    {
      id: "4",
      name: "dzikidzekson",
      username: "",
      email: "example@gmail.com",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHStJewkkY66Yb4j4H4OTaNlzscE2kqwnMA&s",
      backgroundImage:
        "https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "4",
      name: "dzikidzekson",
      username: "",
      email: "example@gmail.com",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHStJewkkY66Yb4j4H4OTaNlzscE2kqwnMA&s",
      backgroundImage:
        "https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "4",
      name: "dzikidzekson",
      username: "",
      email: "example@gmail.com",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHStJewkkY66Yb4j4H4OTaNlzscE2kqwnMA&s",
      backgroundImage:
        "https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "4",
      name: "dzikidzekson",
      username: "",
      email: "example@gmail.com",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHStJewkkY66Yb4j4H4OTaNlzscE2kqwnMA&s",
      backgroundImage:
        "https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "4",
      name: "dzikidzekson",
      username: "",
      email: "example@gmail.com",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHStJewkkY66Yb4j4H4OTaNlzscE2kqwnMA&s",
      backgroundImage:
        "https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
    {
      id: "75cd0b63-3cdb-4c1f-9892-a5bfbb6b4358",
      name: "Michał Strojny",
      username: "",
      email: "bazyl.cossac@gmail.com",
      image: "https://avatars.githubusercontent.com/u/102479081?v=4",
      backgroundImage: null,
    },
  ];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="flex flex-row items-center gap-1 hover:cursor-pointer">
          {user[type].length} Following
        </span>
      </DialogTrigger>
      <DialogContent className="w-4/5 md:max-w-[425px] md:max-h-[500px] overflow-y-auto bg-[#0D0D0D] border-none">
        <DialogHeader>
          <DialogTitle>Your followers</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {/* CONTENT */}

        {data?.map((user) => (
          <div key={user.id}>
            <Link
              href={`/profile/${user.id}`}
              className="flex flex-row items-center gap-2"
            >
              <Image
                src={user.image}
                alt="user image"
                width={50}
                height={50}
                className="size-8 rounded-full"
              />
              <p className="text-sm font-bold">{user.name}</p>
            </Link>
          </div>
        ))}

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
