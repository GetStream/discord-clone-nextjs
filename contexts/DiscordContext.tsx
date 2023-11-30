'use client';

import { DiscordServer } from '@/app/page';
import { createContext, useContext, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { v4 as uuid } from 'uuid';

type DiscordState = {
  server?: DiscordServer;
  changeServer: (server: DiscordServer) => void;
  createServer: (client: StreamChat, name: string, imageUrl: string) => void;
};

const initialValue: DiscordState = {
  server: undefined,
  changeServer: () => {},
  createServer: () => {},
};

const DiscordContext = createContext<DiscordState>(initialValue);

export const DiscordContextProvider: any = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [myState, setMyState] = useState<DiscordState>(initialValue);

  function changeServer(server: DiscordServer) {
    setMyState({ ...myState, server });
  }

  async function createServer(
    client: StreamChat,
    name: string,
    imageUrl: string
  ) {
    if (client.userID) {
      const channel = client.channel('messaging', uuid(), {
        name: 'Welcome',
        members: [client.userID, 'test-user'],
        data: {
          image: imageUrl,
          server: name,
          category: 'Text Channels',
        },
      });
      try {
        const response = await channel.create();
        console.log('[createServer] Response: ', response);
        changeServer({ name, image: imageUrl });
      } catch (err) {
        console.log(err);
      }
    }
  }

  const store: DiscordState = {
    server: myState.server,
    changeServer: changeServer,
    createServer: createServer,
  };

  return (
    <DiscordContext.Provider value={store}>{children}</DiscordContext.Provider>
  );
};

export const useDiscordContext = () => useContext(DiscordContext);
