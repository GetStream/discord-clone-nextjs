'use client';

import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { ChannelListMessengerProps, useChatContext } from 'stream-chat-react';

import { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';
import { Channel } from 'stream-chat';
import CustomChannelPreview from './CustomChannelPreview';
import { useDiscordContext } from '@/contexts/DiscordContext';

const CustomChannelList: React.FC<ChannelListMessengerProps> = (
  props: PropsWithChildren<ChannelListMessengerProps>
) => {
  const { children, ...rest } = props;
  const { client } = useChatContext();
  const { server } = useDiscordContext();
  const [channelsByCategories, setChannelsByCategories] = useState<
    Map<string, Array<Channel<DefaultStreamChatGenerics>>>
  >(new Map());

  const loadChannelsByCategories = useCallback(async (): Promise<void> => {
    const channels = await client.queryChannels({});
    const categories = new Set(
      channels
        .filter((channel) => {
          return channel.data?.data?.server === server?.name;
        })
        .map((channel) => {
          return channel.data?.data?.category;
        })
    );

    const channelsMap = new Map<
      string,
      Array<Channel<DefaultStreamChatGenerics>>
    >();
    for (const category of Array.from(categories)) {
      channelsMap.set(
        category,
        channels.filter((channel) => {
          return (
            channel.data?.data?.server === server?.name &&
            channel.data?.data?.category === category
          );
        })
      );
    }

    setChannelsByCategories(channelsMap);
  }, [client, server]);

  useEffect(() => {
    loadChannelsByCategories();
  }, [loadChannelsByCategories]);

  return (
    <div className='w-64 bg-gray-100 h-full flex flex-col items-start'>
      {server?.name && (
        <div className='flex w-full'>
          <h2 className='text-lg font-bold text-gray-700 p-4 border-b-2 border-gray-300 w-full hover:bg-gray-300'>
            {server?.name}
          </h2>
          <button>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3'
              />
            </svg>
          </button>
        </div>
      )}

      <div>
        {Array.from(channelsByCategories.keys()).map((category, index) => {
          return (
            <details className='p-2' key={`${category}-${index}`}>
              <summary className='mb-2 uppercase text-sm font-bold text-gray-500'>
                {category}
              </summary>
              {channelsByCategories.get(category)?.map((channel) => {
                return (
                  <CustomChannelPreview key={channel.id} channel={channel} />
                );
              })}
            </details>
          );
        })}
      </div>
      {/* {children} */}
    </div>
  );

  async function addChannelClicked() {
    if (client.userID) {
      const channel = client.channel('messaging', {
        name: 'My New Channel',
        members: [client.userID],
        data: {
          image: 'https://source.unsplash.com/random/100x100',
          server: 'My New Server',
          category: 'Text Channels',
        },
      });
      try {
        const response = await channel.create();
      } catch (err) {
        console.log(err);
      }
    }
  }
};

export default CustomChannelList;
