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
    <div className='w-64 bg-gray-100 h-full flex flex-col items-start'>
      <ChannelListTopBar serverName={server?.name || 'Direct Messages'} />

      <div className='w-full'>
        {Array.from(channelsByCategories.keys()).map((category, index) => {
          return (
            <details className='p-2' key={`${category}-${index}`} open>
              <summary className='mb-2 uppercase text-sm font-bold text-gray-500 px-2 w-full space-x-8'>
                <div>
                  <span className='inline-block'>{category}</span>
                  <Link
                    className='inline-block'
                    href={`/?createChannel=true&serverName=${server?.name}&category=${category}`}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={2}
                      stroke='currentColor'
                      className='w-5 h-5'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M12 4.5v15m7.5-7.5h-15'
                      />
                    </svg>
                  </Link>
                </div>
              </summary>
              <div>
                {channelsByCategories.get(category)?.map((channel) => {
                  return (
                    <CustomChannelPreview key={channel.id} channel={channel} />
                  );
                })}
              </div>
            </details>
          );
        })}
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
