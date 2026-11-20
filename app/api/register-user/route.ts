import { clerkClient, currentUser } from '@clerk/nextjs';
import { StreamClient } from '@stream-io/node-sdk';

export async function POST() {
  // Register the signed-in Clerk user, never a user id from the request
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = clerkUser.id;
  const mail = clerkUser.emailAddresses.find(
    (address) => address.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  if (!mail) {
    return Response.error();
  }

  const serverClient = new StreamClient(
    '7cu55d72xtjs',
    process.env.STREAM_CHAT_SECRET!
  );

  await serverClient.upsertUsers([
    {
      id: userId,
      role: 'user',
      name: mail,
      custom: {
        imageUrl: `https://getstream.io/random_png/?id=${userId}&name=${mail}`,
      },
    },
  ]);

  const params = {
    publicMetadata: {
      streamRegistered: true,
    },
  };
  const updatedUser = await clerkClient.users.updateUser(userId, params);

  console.log('[/api/register-user] User:', updatedUser.id);
  const response = {
    userId: userId,
    userName: mail,
  };

  return Response.json(response);
}
