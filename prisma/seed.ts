import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const userData: Prisma.UserCreateInput = {
  id: "4",
  name: "dzikidzekson",
  username: "",
  image:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHStJewkkY66Yb4j4H4OTaNlzscE2kqwnMA&s",
  email: "example@gmail.com",
  posts: {
    create: [
      {
        postText: "Test",
        postImage:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQHStJewkkY66Yb4j4H4OTaNlzscE2kqwnMA&s",
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
