import { useClient } from '@/hooks/useClient';
import { User } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelList,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';

import CustomChannelList from '@/components/ChannelList/CustomChannelList';
import ServerList from '@/components/ServerList/ServerList';
import MessageComposer from '@/components/MessageList/MessageComposer/MessageComposer';
import CustomDateSeparator from '@/components/MessageList/CustomDateSeparator/CustomDateSeparator';
import CustomMessage from '@/components/MessageList/CustomMessage/CustomMessage';
import { customReactionOptions } from '@/components/MessageList/CustomReactions/CustomReactionsSelector';

export default function MyChat({
  apiKey,
  user,
  token,
}: {
  apiKey: string;
  user: User;
  token: string;
}) {
  const chatClient = useClient({
    apiKey,
    user,
    tokenOrProvider: token,
  });

  if (!chatClient) {
    return <div>Error, please try again later.</div>;
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
