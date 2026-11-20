'use client';

import { DiscordServer } from '@/DiscordServer';
import { MemberRequest, StreamVideoClient } from '@stream-io/video-react-sdk';
import { createContext, useCallback, useContext, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { v4 as uuid } from 'uuid';

type DiscordState = {
  server?: DiscordServer;
  callId: string | undefined;
  changeServer: (server: DiscordServer | undefined) => void;
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
    server: DiscordServer,
    channelName: string,
    userIds: string[]
  ) => Promise<void>;
  setCall: (callId: string | undefined) => void;
};

const initialValue: DiscordState = {
  server: undefined,
  callId: undefined,
  changeServer: () => {},
  createServer: () => {},
  createChannel: () => {},
  createCall: async () => {},
  setCall: () => {},
};

const DiscordContext = createContext<DiscordState>(initialValue);

// The creator always becomes a member, so the new channel shows up in their list
function withCurrentUser(client: StreamChat, userIds: string[]): string[] {
  return client.userId
    ? Array.from(new Set([client.userId, ...userIds]))
    : userIds;
}

export const DiscordContextProvider: any = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [myState, setMyState] = useState<DiscordState>(initialValue);

  // The channels themselves come from the ChannelPaginator (see MyChat.tsx);
  // CustomChannelList splits them by the selected server.
  const changeServer = useCallback(
    (server: DiscordServer | undefined) => {
      setMyState((myState) => {
        return { ...myState, server };
      });
    },
    [setMyState]
  );

  const createCall = useCallback(
    async (
      client: StreamVideoClient,
      server: DiscordServer,
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
              // serverId: server?.id,
              serverName: server?.name,
              callName: channelName,
            },
            members: audioChannelMembers,
          },
        });
        console.log(
          `[DiscordContext] Created Call with id: ${createdAudioCall.call.id}`
        );
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  const createServer = useCallback(
    async (
      client: StreamChat,
      videoClient: StreamVideoClient,
      name: string,
      imageUrl: string,
      userIds: string[]
    ) => {
      const server: DiscordServer = { name, image: imageUrl };
      const messagingChannel = client.channel('messaging', uuid(), {
        custom: {
          name: 'Welcome',
          data: {
            image: imageUrl,
            server: name,
            category: 'Text Channels',
          },
        },
        members: withCurrentUser(client, userIds).map((userId) => ({
          user_id: userId,
        })),
      });

      try {
        const response = await messagingChannel.create();
        console.log('[DiscordContext - createServer] Response: ', response);
        await createCall(
          videoClient,
          server,
          'General Voice Channel',
          withCurrentUser(client, userIds)
        );
        changeServer(server);
      } catch (err) {
        console.error(err);
      }
    },
    [changeServer, createCall]
  );

  const createChannel = useCallback(
    async (
      client: StreamChat,
      name: string,
      category: string,
      userIds: string[]
    ) => {
      if (client.userId) {
        // An explicit id, so channels with the same members stay distinct
        const channel = client.channel('messaging', uuid(), {
          custom: {
            name: name,
            data: {
              server: myState.server?.name,
              category: category,
            },
          },
          members: withCurrentUser(client, userIds).map((userId) => ({
            user_id: userId,
          })),
        });
        try {
          const response = await channel.create();
        } catch (err) {
          console.log(err);
        }
      }
    },
    [myState.server?.name]
  );

  const setCall = useCallback(
    (callId: string | undefined) => {
      setMyState((myState) => {
        return { ...myState, callId };
      });
    },
    [setMyState]
  );

  const store: DiscordState = {
    server: myState.server,
    callId: myState.callId,
    changeServer: changeServer,
    createServer: createServer,
    createChannel: createChannel,
    createCall: createCall,
    setCall: setCall,
  };

  return (
    <DiscordContext.Provider value={store}>{children}</DiscordContext.Provider>
  );
};

export const useDiscordContext = () => useContext(DiscordContext);
