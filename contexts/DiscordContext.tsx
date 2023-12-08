'use client';

import { DiscordServer } from '@/app/page';
import { createContext, useCallback, useContext, useState } from 'react';
import { Channel, StreamChat } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';
import { v4 as uuid } from 'uuid';

type DiscordState = {
  server?: DiscordServer;
  channelsByCategories: Map<string, Array<Channel<DefaultStreamChatGenerics>>>;
  changeServer: (server: DiscordServer, client: StreamChat) => void;
  createServer: (client: StreamChat, name: string, imageUrl: string) => void;
  createChannel: (
    client: StreamChat,
    name: string,
    category: string,
    userIds: string[]
  ) => void;
};

const initialValue: DiscordState = {
  server: undefined,
  channelsByCategories: new Map(),
  changeServer: () => {},
  createServer: () => {},
  createChannel: () => {},
};

const DiscordContext = createContext<DiscordState>(initialValue);

export const DiscordContextProvider: any = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [myState, setMyState] = useState<DiscordState>(initialValue);

  const changeServer = useCallback(
    async (server: DiscordServer, client: StreamChat) => {
      console.log('[changeServer] server: ', server);
      const channels = await client.queryChannels({});
      const categories = new Set(
        channels
          .filter((channel) => {
            return channel.data?.data?.server === server.name;
          })
          .map((channel) => {
            return channel.data?.data?.category;
          })
      );

      const channelsByCategories = new Map<
        string,
        Array<Channel<DefaultStreamChatGenerics>>
      >();
      for (const category of Array.from(categories)) {
        channelsByCategories.set(
          category,
          channels.filter((channel) => {
            return (
              channel.data?.data?.server === server.name &&
              channel.data?.data?.category === category
            );
          })
        );
      }
      setMyState((myState) => {
        return { ...myState, server, channelsByCategories };
      });
    },
    [setMyState]
  );

  const createServer = useCallback(
    async (client: StreamChat, name: string, imageUrl: string) => {
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
          changeServer({ name, image: imageUrl }, client);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [changeServer]
  );

  const createChannel = useCallback(
    async (
      client: StreamChat,
      name: string,
      category: string,
      userIds: string[]
    ) => {
      if (client.userID) {
        const channel = client.channel('messaging', {
          name: name,
          members: userIds,
          data: {
            server: myState.server?.name,
            category: category,
          },
        });
        try {
          const response = await channel.create();
          console.log('[createChannel] Response: ', response);
        } catch (err) {
          console.log(err);
        }
      }
    },
    [myState.server?.name]
  );

  const store: DiscordState = {
    server: myState.server,
    channelsByCategories: myState.channelsByCategories,
    changeServer: changeServer,
    createServer: createServer,
    createChannel: createChannel,
  };

  return (
    <DiscordContext.Provider value={store}>{children}</DiscordContext.Provider>
  );
};

export const useDiscordContext = () => useContext(DiscordContext);
