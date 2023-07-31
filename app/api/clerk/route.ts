import { convexClient } from "@/app/convex";
import { api } from "@/convex/_generated/api";
import { WebhookEvent } from "@clerk/clerk-sdk-node";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

async function validateRequest(
  req: Request
): Promise<WebhookEvent | undefined> {
  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  try {
    return wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (e) {
    console.error(e);
    return;
  }
}

export async function POST(request: Request) {
  const evt = await validateRequest(request);

  if (!evt) {
    return NextResponse.error();
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      await convexClient.mutation(api.users.upsertUser, {
        user: {
          id: evt.data.id,
          email:
            evt.data.email_addresses.find(
              (e) => e.id === evt.data.primary_email_address_id
            )?.email_address || "No Primary Email",
          name: `${evt.data.first_name} ${evt.data.last_name}`,
        },
      });
    }
    case "user.deleted":
      console.log({ evt });
      break;
    case "session.created":
    case "session.ended":
    case "session.removed":
    case "session.revoked":
      await convexClient.mutation(api.users.upsertSession, {
        session: evt.data,
      });
      console.log({ evt });
      break;
    case "organization.created":
    case "organization.updated":
    case "organization.deleted":
    case "organizationMembership.created":
    case "organizationMembership.deleted":
    case "organizationMembership.updated":
    case "organizationInvitation.accepted":
    case "organizationInvitation.created":
    case "organizationInvitation.revoked":
      break;
  }

  return NextResponse.json({ message: "Hello from Clerk!" });
}

export async function GET() {
  return NextResponse.json({ message: "Hello from Clerk!" });
}

export async function PUT() {
  const allUsers = await clerkClient.users.getUserList({
    limit: 100,
  });
  const allSessions = await clerkClient.sessions.getSessionList();
  console.log(
    `Syncing ${allUsers.length} users and ${allSessions.length} sessions`
  );
  await Promise.all(
    [
      allUsers.map((user) =>
        convexClient.mutation(api.users.upsertUser, {
          user: {
            id: user.id,
            email:
              user.emailAddresses.find(
                (e) => e.id === user.primaryEmailAddressId
              )?.emailAddress || "No Primary Email",
            name: `${user.firstName} ${user.lastName}`,
          },
        })
      ),
      allSessions.map((session) =>
        convexClient.mutation(api.users.upsertSession, {
          session: {
            id: session.id,
            user_id: session.userId,
            status: session.status,
            created_at: session.createdAt,
            last_active_at: session.lastActiveAt,
            expire_at: session.expireAt,
          },
        })
      ),
    ].flat()
  );
}
