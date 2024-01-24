'use client';

import { PropsWithChildren } from 'react';
import { ChannelListMessengerProps } from 'stream-chat-react';

import CustomChannelPreview from './CustomChannelPreview';
import { useDiscordContext } from '@/contexts/DiscordContext';
import Link from 'next/link';
import CreateChannelForm from './CreateChannelForm';
import UserBar from './UserBar/UserBar';
import { Channel } from 'stream-chat';
import { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';
import { DiscordServer } from '@/app/page';
import ChannelListTopBar from './TopBar/ChannelListTopBar';
import CategoryItem from './Category/CategoryItem';

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
    <div className='w-64 bg-medium-bg-gray h-full flex flex-col items-start'>
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
