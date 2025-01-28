import { getPosts } from "@/lib/utils"; // Funkcja z Prisma

export default async function handler(req, res) {
  const { pageParam } = req.query;

  try {
    const data = await getPosts({ pageParam: parseInt(pageParam, 10) || 0 });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
}
