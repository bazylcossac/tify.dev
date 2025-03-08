import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const authSession = await auth();

  if (!authSession?.user?.email) {
    return NextResponse.redirect("Forbidden", 403);
  }
  const priceId = req.url.split("?")[1];
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    const session = await stripe.checkout.sessions.create({
      customer_email: authSession?.user?.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/premium`,
      cancel_url: `${origin}/premium`,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json({ error: error.message });
  }
}
