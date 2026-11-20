import { StreamClient } from '@stream-io/node-sdk';

export async function POST(request: Request) {
  const serverClient = new StreamClient(
    '7cu55d72xtjs',
    process.env.STREAM_CHAT_SECRET!
  );
  const body = await request.json();
  console.log('[/api/token] Body:', body);

  const userId = body?.userId;

  if (!userId) {
    return Response.error();
  }

  // The client connects with this token as a fixed string (no token provider
  // to refresh it), so mint one without an expiry.
  const token = serverClient.generatePermanentUserToken({ user_id: userId });

  const response = {
    userId: userId,
    token: token,
  };

  return Response.json(response);
}
