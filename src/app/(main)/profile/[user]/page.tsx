import Loading from "@/components/loading";
import UsersPosts from "@/components/users-posts-profile";
import UserProfileMain from "@/components/user-profile-main";
import { getUserById } from "@/actions/actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function Page({ params }: { params: { user: string } }) {
  const userId = await params;

  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const user = await getUserById(userId.user);

  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justifty-center ">
        <Loading />
      </div>
    );
  }

  return (
    <main className="w-full h-full mt-4 md:mt-10 px-2 flex flex-col ">
      <section className="w-full ">
        <div className="relative">
          <UserProfileMain user={user} />
        </div>
      </section>

      <section>
        <UsersPosts userId={userId.user} />
      </section>
    </main>
  );
}

export default Page;
