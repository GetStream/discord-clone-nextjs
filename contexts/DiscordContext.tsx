'use client';

import { DiscordServer } from '@/app/page';
import { MemberRequest, StreamVideoClient } from '@stream-io/video-client';
import { createContext, useCallback, useContext, useState } from 'react';
import { Channel, ChannelFilters, StreamChat } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react';
import { v4 as uuid } from 'uuid';

type DiscordState = {
  server?: DiscordServer;
  channelsByCategories: Map<string, Array<Channel<DefaultStreamChatGenerics>>>;
  changeServer: (server: DiscordServer | undefined, client: StreamChat) => void;
  createServer: (
    client: StreamChat,
    videoClient: StreamVideoClient,
    name: string,
    imageUrl: string,
    userIds: string[]
  ) => void;
  createChannel: (
    client: StreamChat,
    name: string,
    category: string,
    userIds: string[]
  ) => void;
  createCall: (
    client: StreamVideoClient,
    serverName: string,
    channelName: string,
    userIds: string[]
  ) => void;
};

const initialValue: DiscordState = {
  server: undefined,
  channelsByCategories: new Map(),
  changeServer: () => {},
  createServer: () => {},
  createChannel: () => {},
  createCall: () => {},
};

const DiscordContext = createContext<DiscordState>(initialValue);

export const DiscordContextProvider: any = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [myState, setMyState] = useState<DiscordState>(initialValue);

  const changeServer = useCallback(
    async (server: DiscordServer | undefined, client: StreamChat) => {
      console.log('[changeServer] server: ', server);
      let filters: ChannelFilters = {
        type: 'messaging',
        members: { $in: [client.userID as string] },
      };
      if (!server) {
        filters.member_count = 2;
      }

      console.log('[loadServerList] Querying channels for ', client.userID);
      const channels = await client.queryChannels(filters);
      const channelsByCategories = new Map<
        string,
        Array<Channel<DefaultStreamChatGenerics>>
      >();
      if (server) {
        const categories = new Set(
          channels
            .filter((channel) => {
              return channel.data?.data?.server === server.name;
            })
            .map((channel) => {
              return channel.data?.data?.category;
            })
        );

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
      } else {
        channelsByCategories.set('Direct Messages', channels);
      }
      setMyState((myState) => {
        return { ...myState, server, channelsByCategories };
      });
    },
    [setMyState]
  );

  const createServer = useCallback(
    async (
      client: StreamChat,
      videoClient: StreamVideoClient,
      name: string,
      imageUrl: string,
      userIds: string[]
    ) => {
      const messagingChannel = client.channel('messaging', uuid(), {
        name: 'Welcome',
        members: userIds,
        data: {
          image: imageUrl,
          server: name,
          category: 'Text Channels',
        },
      });
      const callId = uuid();
      const audioCall = videoClient.call('default', callId);
      const audioChannelMembers: MemberRequest[] = userIds.map((userId) => {
        return {
          user_id: userId,
        };
      });

      try {
        const response = await messagingChannel.create();
        console.log('[createServer] Response: ', response);
        const createdAudioCall = await audioCall.create({
          data: {
            custom: {
              serverName: name,
            },
            members: audioChannelMembers,
          },
        });
        console.log('[createServer] Audio Call: ', createdAudioCall);
        changeServer({ name, image: imageUrl }, client);
      } catch (err) {
        console.log(err);
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
        const channel = client.channel('team', {
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

  const createCall = useCallback(
    async (
      client: StreamVideoClient,
      serverName: string,
      channelName: string,
      userIds: string[]
    ) => {
      const callId = uuid();
      const audioCall = client.call('default', callId);
      const audioChannelMembers: MemberRequest[] = userIds.map((userId) => {
        return {
          user_id: userId,
        };
      });
      try {
        const createdAudioCall = await audioCall.create({
          data: {
            custom: {
              serverName: serverName,
              callName: channelName,
            },
            members: audioChannelMembers,
          },
        });
        console.log('[createCall] Audio Call: ', createdAudioCall);
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const store: DiscordState = {
    server: myState.server,
    channelsByCategories: myState.channelsByCategories,
    changeServer: changeServer,
    createServer: createServer,
    createChannel: createChannel,
    createCall: createCall,
  };

  return (
    <DiscordContext.Provider value={store}>{children}</DiscordContext.Provider>
  );
};

export const useDiscordContext = () => useContext(DiscordContext);
