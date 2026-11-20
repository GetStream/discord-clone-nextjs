import { useEffect, useMemo, useState } from 'react';
import { useClient } from '@/hooks/useClient';
import { ChannelPaginator, Thread as StreamThread } from 'stream-chat';
import type {
  Channel as StreamChannel,
  ClientUser,
  SortParamRequest,
} from 'stream-chat';
import {
  Chat,
  Channel,
  defaultWorkspaceNavigation,
  MessageList,
  MessageComposer,
  Thread,
  ThreadHeader,
  WithComponents,
  WorkspaceNavigationProvider,
} from 'stream-chat-react';
import type { WorkspaceNavigation } from 'stream-chat-react';
import { useActiveThread } from 'stream-chat-react/slot-layout';

import CustomChannelList from '@/components/ChannelList/CustomChannelList';
import ServerList from '@/components/ServerList';
import CustomMessageComposer from '@/components/MessageList/MessageComposer/MessageComposer';
import CustomDateSeparator from '@/components/MessageList/CustomDateSeparator/CustomDateSeparator';
import CustomMessage from '@/components/MessageList/CustomMessage/CustomMessage';
import { customMessageReactions } from '@/components/MessageList/CustomReactions/customMessageReactions';
import { useVideoClient } from '@/hooks/useVideoClient';
import { StreamVideo } from '@stream-io/video-react-sdk';
import { useDiscordContext } from '@/contexts/DiscordContext';
import MyCall from '@/components/MyCall/MyCall';
import CustomChannelHeader from './MessageList/CustomChannelHeader/CustomChannelHeader';

const sort: SortParamRequest[] = [{ direction: -1, field: 'last_message_at' }];

export default function MyChat({
  apiKey,
  user,
  token,
}: {
  apiKey: string;
  user: ClientUser;
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
  const [channel, setChannel] = useState<StreamChannel>();
  const [thread, setThread] = useState<StreamThread>();

  // The channels of the current user, kept up to date by the channel manager
  const paginator = useMemo(
    () =>
      chatClient &&
      new ChannelPaginator({
        client: chatClient,
        filters: { members: { $in: [user.id] }, type: 'messaging' },
        id: 'channels',
        sort,
      }),
    [chatClient, user.id]
  );

  useEffect(() => {
    if (!chatClient || !paginator) return;
    chatClient.channelManager.insertPaginator({ paginator });
    return () => {
      chatClient.channelManager.removePaginator(paginator);
    };
  }, [chatClient, paginator]);

  // Marks the open thread as on screen, so its new replies are marked read
  useActiveThread({ activeThread: thread });

  // Opening a channel or a thread from the Stream components updates our state
  const navigation = useMemo<WorkspaceNavigation>(
    () => ({
      ...defaultWorkspaceNavigation,
      closeThread: () => setThread(undefined),
      isChannelActive: (cid) => cid !== undefined && cid === channel?.cid,
      isThreadActive: (threadId) =>
        threadId !== undefined && threadId === thread?.id,
      isThreadDismissable: () => true,
      openChannel: (nextChannel) => {
        setChannel(nextChannel);
        setThread(undefined);
      },
      openChannels: channel ? [channel] : [],
      openThread: (target) =>
        setThread(
          target instanceof StreamThread
            ? target
            : chatClient?.threads.ensure({
                channel: target.channel,
                parentMessage: target.message,
              })
        ),
      openThreads: thread ? [thread] : [],
    }),
    [channel, chatClient, thread]
  );

  if (!chatClient || !paginator) {
    return <div>Error, please try again later.</div>;
  }

  if (!videoClient) {
    return <div>Video Error, please try again later.</div>;
  }

  return (
    <StreamVideo client={videoClient}>
      <Chat client={chatClient} theme='str-chat__theme-light'>
        <WorkspaceNavigationProvider value={navigation}>
          <section className='flex h-screen w-screen layout'>
            <ServerList />
            <CustomChannelList paginator={paginator} />
            {callId && <MyCall callId={callId} />}
            {!callId && (
              <WithComponents
                overrides={{
                  MessageUI: CustomMessage,
                  MessageComposerUI: CustomMessageComposer,
                  DateSeparator: CustomDateSeparator,
                  reactionOptions: customMessageReactions,
                  HeaderComponent: CustomChannelHeader,
                }}
              >
                <div className='flex'>
                  {channel && (
                    <Channel channel={channel}>
                      <MessageList />
                      <MessageComposer />
                    </Channel>
                  )}
                  {thread && (
                    <Thread thread={thread}>
                      <ThreadHeader />
                      <MessageList />
                      <MessageComposer />
                    </Thread>
                  )}
                </div>
              </WithComponents>
            )}
          </section>
        </WorkspaceNavigationProvider>
      </Chat>
    </StreamVideo>
  );
}
