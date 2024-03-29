'use client';

import { PropsWithChildren } from 'react';
import {
  ChannelListMessengerProps,
  DefaultStreamChatGenerics,
} from 'stream-chat-react';

import { useDiscordContext } from '@/contexts/DiscordContext';
import CreateChannelForm from './CreateChannelForm/CreateChannelForm';
import UserBar from './BottomBar/ChannelListBottomBar';
import { Channel } from 'stream-chat';
import { DiscordServer } from '@/app/page';
import ChannelListTopBar from './TopBar/ChannelListTopBar';
import CategoryItem from './CategoryItem/CategoryItem';
import CallList from './CallList/CallList';

const CustomChannelList: React.FC<ChannelListMessengerProps> = (
  props: PropsWithChildren<ChannelListMessengerProps>
) => {
  console.log('[CustomChannelList]');
  const { server } = useDiscordContext();
  const channelsByCategories = splitChannelsIntoCategories(
    props.loadedChannels || [],
    server
  );

  return (
    <div className='w-72 bg-medium-gray h-full flex flex-col items-start'>
      <ChannelListTopBar serverName={server?.name || 'Direct Messages'} />

      <div className='w-full'>
        {Array.from(channelsByCategories.keys()).map((category, index) => (
          <CategoryItem
            key={`${category}-${index}`}
            category={category}
            serverName={server?.name || 'Direct Messages'}
            channels={channelsByCategories.get(category) || []}
          />
        ))}
      </div>
      <CallList />
      <CreateChannelForm />
      <UserBar />
    </div>
  );
};

function splitChannelsIntoCategories(
  channels: Channel<DefaultStreamChatGenerics>[],
  server: DiscordServer | undefined
): Map<string, Array<Channel<DefaultStreamChatGenerics>>> {
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
  return channelsByCategories;
}

export default CustomChannelList;
