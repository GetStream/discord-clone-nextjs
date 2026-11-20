'use client';

import type { ClientUser } from 'stream-chat';
import { LoadingIndicator } from 'stream-chat-react';

import { useClerk } from '@clerk/nextjs';
import { useCallback, useEffect, useState } from 'react';
import MyChat from '@/components/MyChat';

// const userId = '7cd445eb-9af2-4505-80a9-aa8543c3343f';
// const userName = 'Harry Potter';

const apiKey = '7cu55d72xtjs';
// const userToken =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2NkNDQ1ZWItOWFmMi00NTA1LTgwYTktYWE4NTQzYzMzNDNmIn0.TtrCA5VoRB2KofI3O6lYjYZd2pHdQT408u7ryeWO4Qg';

export type Homestate = {
  apiKey: string;
  user: ClientUser;
  token: string;
};

export default function Home() {
  const [myState, setMyState] = useState<Homestate | undefined>(undefined);

  const { user: myUser } = useClerk();

  const registerUser = useCallback(
    async function registerUser() {
      // register user on Stream backend
      console.log('[registerUser] myUser:', myUser);
      const userId = myUser?.id;
      const mail = myUser?.primaryEmailAddress?.emailAddress;
      if (userId && mail) {
        // The route reads the user from the Clerk session
        const streamResponse = await fetch('/api/register-user', {
          method: 'POST',
        });
        const responseBody = await streamResponse.json();
        console.log('[registerUser] Stream response:', responseBody);
        return responseBody;
      }
    },
    [myUser]
  );

  useEffect(() => {
    if (
      myUser?.id &&
      myUser?.primaryEmailAddress?.emailAddress &&
      !myUser?.publicMetadata.streamRegistered
    ) {
      console.log('[Page - useEffect] Registering user on Stream backend');
      registerUser().then((result) => {
        console.log('[Page - useEffect] Result: ', result);
        getUserToken(
          myUser.id,
          myUser?.primaryEmailAddress?.emailAddress || 'Unknown'
        );
      });
    } else {
      // take user and get token
      if (myUser?.id) {
        console.log(
          '[Page - useEffect] User already registered on Stream backend: ',
          myUser?.id
        );
        getUserToken(
          myUser?.id || 'Unknown',
          myUser?.primaryEmailAddress?.emailAddress || 'Unknown'
        );
      }
    }
  }, [registerUser, myUser]);

  if (!myState) {
    return <LoadingIndicator />;
  }

  return <MyChat {...myState} />;

  async function getUserToken(userId: string, userName: string) {
    // The route mints the token for the user of the Clerk session
    const response = await fetch('/api/token', {
      method: 'POST',
    });
    const responseBody = await response.json();
    const token = responseBody.token;

    if (!token) {
      console.error("Couldn't retrieve token.");
      return;
    }

    const user: ClientUser = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
    };
    setMyState({
      apiKey: apiKey,
      user: user,
      token: token,
    });
  }
}
