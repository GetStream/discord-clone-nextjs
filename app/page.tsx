'use client';

import { User } from 'stream-chat';
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

import CustomChannelList from '@/components/ChannelList/CustomChannelList';
import ServerList from '@/components/ServerList/ServerList';
import MessageComposer from '@/components/MessageList/MessageComposer/MessageComposer';
import CustomDateSeparator from '@/components/MessageList/CustomDateSeparator/CustomDateSeparator';
import CustomMessage from '@/components/MessageList/CustomMessage/CustomMessage';
import {
  CustomReactionSelector,
  customReactionOptions,
} from '@/components/MessageList/CustomReactions/CustomReactionsSelector';

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
        <Channel
          Message={CustomMessage}
          Input={MessageComposer}
          DateSeparator={CustomDateSeparator}
          reactionOptions={customReactionOptions}
        >
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
