'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChannelListMessengerProps, useChatContext } from 'stream-chat-react';

import DiscordIcon from '../public/discord.svg';
import { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';
import { Channel } from 'stream-chat';
import CustomChannelPreview from './CustomChannelPreview';
import { useDiscordContext } from '@/contexts/DiscordContext';

const CustomChannelList: React.FC<ChannelListMessengerProps> = (
  props: PropsWithChildren<ChannelListMessengerProps>
) => {
  const { children, ...rest } = props;
  const { client, channels } = useChatContext();
  const { server } = useDiscordContext();
  const [channelsByCategories, setChannelsByCategories] = useState<
    Map<string, Array<Channel<DefaultStreamChatGenerics>>>
  >(new Map());
  useEffect(() => {
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
  }, [server, channels]);

  return (
    <div className='w-64 bg-gray-100 h-full flex flex-col items-start'>
      <button
        className='flex items-center justify-center w-full p-4 border-b-2 mb-4'
        onClick={() => console.log('clicked')}
      >
        <Image
          className='block'
          src={DiscordIcon}
          width={50}
          height={50}
          alt='Discord Icon'
        />
      </button>
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
