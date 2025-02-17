import { getUserPosts } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
export const dynamic = "force-dynamic";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { pageParam, userId } = req.query;

  try {
    const data = await getUserPosts({
      pageParam: parseInt(pageParam as string, 10) || 0,
      userId: userId,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
}
