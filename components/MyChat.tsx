import { useClient } from '@/hooks/useClient';
import { User } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelList,
  ChannelHeader,
  MessageList,
  MessageComposer,
  Thread,
  Window,
  WithComponents,
} from 'stream-chat-react';

import CustomChannelList from '@/components/ChannelList/CustomChannelList';
import ServerList from '@/components/ServerList/ServerList';
import CustomMessageComposer from '@/components/MessageList/MessageComposer/MessageComposer';
import CustomDateSeparator from '@/components/MessageList/CustomDateSeparator/CustomDateSeparator';
import CustomMessage from '@/components/MessageList/CustomMessage/CustomMessage';
import { customReactionOptions } from '@/components/MessageList/CustomReactions/CustomReactionsSelector';
import { useVideoClient } from '@/hooks/useVideoClient';
import { StreamVideo } from '@stream-io/video-react-sdk';
import { useDiscordContext } from '@/contexts/DiscordContext';
import MyCall from '@/components/MyCall/MyCall';
import CustomChannelHeader from './MessageList/CustomChannelHeader/CustomChannelHeader';

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
  const videoClient = useVideoClient({
    apiKey,
    user,
    tokenOrProvider: token,
  });
  const { callId } = useDiscordContext();

  if (!chatClient) {
    return <div>Error, please try again later.</div>;
  }

  if (!videoClient) {
    return <div>Video Error, please try again later.</div>;
  }

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient} theme='str-chat__theme-light'>
        <section className='flex h-screen w-screen layout'>
          <ServerList />
          <WithComponents overrides={{ ChannelListUI: CustomChannelList }}>
            <ChannelList sendChannelsToList={true} />
          </WithComponents>
          {callId && <MyCall callId={callId} />}
          {!callId && (
            <WithComponents
              overrides={{
                Message: CustomMessage,
                MessageComposerUI: CustomMessageComposer,
                DateSeparator: CustomDateSeparator,
                reactionOptions: customReactionOptions,
                HeaderComponent: CustomChannelHeader,
              }}
            >
              <Channel>
                <Window>
                  <MessageList />
                  <MessageComposer />
                </Window>
                <Thread />
              </Channel>
            </WithComponents>
          )}
        </section>
      </Chat>
    </StreamVideo>
  );
}
