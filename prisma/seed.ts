import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const userData: Prisma.UserCreateInput = {
  id: "4",
  name: "dzikidzekson",
  username: "",
  backgroundImage:
    "https://images.unsplash.com/photo-1567360425618-1594206637d2?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHStJewkkY66Yb4j4H4OTaNlzscE2kqwnMA&s",
  email: "example@gmail.com",
  premium: true,
  posts: {
    create: [
      {
        postText: "Test",
        likes: 23,
        stars: 3,
        media: {
          create: [
            {
              url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHStJewkkY66Yb4j4H4OTaNlzscE2kqwnMA&s",
              type: "image",
            },
          ],
        },
      },
    ],
  },
};

async function main() {
  await prisma.user.create({
    data: userData,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
