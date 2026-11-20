import { auth } from '@clerk/nextjs';
import { StreamClient } from '@stream-io/node-sdk';

export async function POST() {
  // Only mint a token for the signed-in Clerk user, never for an id from the request
  const { userId } = auth();
  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const serverClient = new StreamClient(
    '7cu55d72xtjs',
    process.env.STREAM_CHAT_SECRET!
  );

  // The client connects with this token as a fixed string (no token provider
  // to refresh it), so mint one without an expiry.
  const token = serverClient.generatePermanentUserToken({ user_id: userId });

  const response = {
    userId: userId,
    token: token,
  };

  return Response.json(response);
}
