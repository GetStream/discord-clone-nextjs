import { UserObject } from '@/model/UserObject';
import { StreamClient, convertTimestampToDate } from '@stream-io/node-sdk';

// Query the users on every request instead of once at build time.
export const dynamic = 'force-dynamic';

export async function GET() {
  const serverClient = new StreamClient(
    '7cu55d72xtjs',
    process.env.STREAM_CHAT_SECRET!
  );
  const response = await serverClient.queryUsers({
    payload: { filter_conditions: {} },
  });
  const data: UserObject[] = response.users
    .filter((user) => user.role !== 'admin')
    .map((user) => {
      return {
        id: user.id,
        name: user.name ?? user.id,
        image: user.image as string,
        online: user.online,
        lastOnline: convertTimestampToDate(user.last_active)?.toISOString(),
      };
    });

  return Response.json({ data });
}
