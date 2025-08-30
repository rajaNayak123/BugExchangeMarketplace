import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Socket.IO temporarily disabled
  return new Response("Socket.IO disabled", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
    },
  });
}

export async function POST(req: NextRequest) {
  // Socket.IO temporarily disabled
  return new Response("Socket.IO disabled", {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-cache",
    },
  });
}
