import { prisma } from "@/lib/db";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
export async function POST(req: Request) {
  const body = await req.text();

  const signature = (await headers()).get("Stripe-Signature");
  if (!signature) return NextResponse.json({}, { status: 400 });

  if (typeof signature !== "string") {
    throw new Error("[STRIPE HOOK] Header isn't a string???");
  }

  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type === "checkout.session.completed") {
    const email = event.data.object.customer_email;
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        premium: true,
      },
    });
  }

  return NextResponse.json({ received: true });
}
