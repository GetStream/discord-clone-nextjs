import { useEffect } from 'react';
import type { Channel, ChannelPaginator } from 'stream-chat';
import { useChannelPaginatorState } from 'stream-chat-react';

import { DiscordServer } from '@/DiscordServer';
import { useDiscordContext } from '@/contexts/DiscordContext';
import CreateChannelForm from './CreateChannelForm/CreateChannelForm';
import UserBar from './BottomBar/ChannelListBottomBar';
import ChannelListTopBar from './TopBar/ChannelListTopBar';
import CategoryItem from './CategoryItem/CategoryItem';
import CallList from './CallList/CallList';

function splitChannelsIntoCategories(
  channels: Channel[],
  server: DiscordServer | undefined
): Map<string, Array<Channel>> {
  const channelsByCategories = new Map<string, Array<Channel>>();
  if (server) {
    const categories = new Set(
      channels
        .filter((channel) => {
          return channel.data?.custom?.data?.server === server.name;
        })
        .map((channel) => {
          return channel.data?.custom?.data?.category;
        })
        .filter((category): category is string => !!category)
    );

    for (const category of Array.from(categories)) {
      channelsByCategories.set(
        category,
        channels.filter((channel) => {
          return (
            channel.data?.custom?.data?.server === server.name &&
            channel.data?.custom?.data?.category === category
          );
        })
      );
    }
  } else {
    channelsByCategories.set('Direct Messages', channels);
  }
  return channelsByCategories;
}

const CustomChannelList = ({ paginator }: { paginator: ChannelPaginator }) => {
  const { server } = useDiscordContext();
  const { channels } = useChannelPaginatorState(paginator);

  // The paginator loads its first page when something asks for it
  useEffect(() => {
    if (!paginator.hasLoadedPage) paginator.toTail();
  }, [paginator]);

  const channelsByCategories = splitChannelsIntoCategories(
    channels || [],
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

export default CustomChannelList;
