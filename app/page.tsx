'use client';

import { ChannelFilters, ChannelOptions, ChannelSort, User } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Window,
  Thread,
  LoadingIndicator,
  ChannelList,
} from 'stream-chat-react';

import { useClient } from '../hooks/useClient';

import 'stream-chat-react/dist/css/v2/index.css';
import CustomChannelList from '@/components/ChannelList/CustomChannelList';
import ServerList from '@/components/ServerList/ServerList';
import MessageComposer from '@/components/MessageList/MessageComposer/MessageComposer';

const userId = '7cd445eb-9af2-4505-80a9-aa8543c3343f';
const userName = 'Harry Potter';

const user: User = {
  id: userId,
  name: userName,
  image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
};

const apiKey = '7cu55d72xtjs';
const userToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2NkNDQ1ZWItOWFmMi00NTA1LTgwYTktYWE4NTQzYzMzNDNmIn0.TtrCA5VoRB2KofI3O6lYjYZd2pHdQT408u7ryeWO4Qg';

export type DiscordServer = {
  name: string;
  image: string | undefined;
};

export default function Home() {
  console.log('[Create]');
  const chatClient = useClient({
    apiKey,
    user,
    tokenOrProvider: userToken,
  });
  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme='str-chat__theme-light'>
      <section className='flex h-screen w-screen layout'>
        <ServerList />
        <ChannelList List={CustomChannelList} sendChannelsToList={true} />
        <Channel Input={MessageComposer}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </section>
    </Chat>
  );
}
