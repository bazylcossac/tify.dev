import Loading from "@/components/loading";
import Image from "next/image";
import ProfileEditDialog from "@/components/profile-edit-dialog";
import { auth } from "@/auth";
import CurrentUserProfilePosts from "@/components/current-user-profile-posts";
import { getUserById } from "@/actions/actions";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AddPostDialog from "@/components/add-post-dialog";

async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const user = await getUserById(session?.userId);

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justifty-center ">
        <Loading />
      </div>
    );
  }

  return (
    <main className="w-full h-full mt-4 md:mt-10 px-2 flex flex-col ">
      <div className="fixed bottom-10 right-10 md:hidden">
        <Suspense fallback={<div>loading...</div>}>
          <AddPostDialog />
        </Suspense>
      </div>
      <section className="w-full ">
        <div className="relative">
          <div className="flex flex-col">
            <Image
              src={
                session.userBackground ||
                "https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt="bg image"
              width={1000}
              height={200}
              quality={50}
              priority
              className="h-[150px] w-full rounded-lg object-cover"
            />
          </div>
          <div className=" flex flex-col ">
            {user.image && (
              <Image
                src={user.image}
                alt="bg image"
                width={100}
                height={100}
                quality={100}
                priority
                className="max-size-28 rounded-lg absolute top-24 left-4 border-4 border-black"
              />
            )}
            <div className="flex flex-row justify-between items-center mt-2">
              <p className="ml-32 font-bold">{user?.name}</p>
              <span className="cursor-pointer ">
                {session.userId && (
                  <ProfileEditDialog userId={session.userId} />
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="hidden text-blue-500"></div>
      </section>

      <section className="mt-6 ml-4 flex flex-row items-center gap-6 text-white/60 font-semibold text-sm">
        <span className="flex flex-row items-center gap-1">
          {user?.follower?.length} Following
        </span>
        <span className="flex flex-row items-center gap-1">
          {user?.followed?.length} Followed
        </span>
      </section>

      <section>
        <CurrentUserProfilePosts />
      </section>
    </main>
  );
}
export default Page;
