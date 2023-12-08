import { useChatContext } from 'stream-chat-react';
import Image from 'next/image';
import DiscordIcon from '../public/discord.svg';
import { useCallback, useEffect, useState } from 'react';
import { DiscordServer } from '@/app/page';
import { useDiscordContext } from '@/contexts/DiscordContext';
import CreateServerForm from './CreateServerForm';
import Link from 'next/link';
import { Channel } from 'stream-chat';

const ServerList = () => {
  console.log('[ServerList]');
  const { client } = useChatContext();
  const { changeServer } = useDiscordContext();
  const [serverList, setServerList] = useState<DiscordServer[]>([]);

  const loadServerList = useCallback(async (): Promise<void> => {
    const channels = await client.queryChannels({});
    const serverList: Set<DiscordServer> = new Set(
      channels
        .map((channel: Channel) => {
          return {
            name: (channel.data?.data?.server as string) ?? 'Unknown',
            image: channel.data?.data?.image,
          };
        })
        .filter((server: DiscordServer) => server.name !== 'Unknown')
    );
    setServerList(Array.from(serverList.values()));
    if (serverList.size > 0) {
      changeServer(Array.from(serverList.values())[0], client);
    }
  }, [client, changeServer]);

  useEffect(() => {
    loadServerList();
  }, [loadServerList]);

  return (
    <div className='bg-gray-200 h-full flex flex-col items-center space-y-4'>
      <button
        className='flex items-center justify-center w-full p-4 border-b-2 border-gray-300 mb-4 relative'
        onClick={() => console.log('clicked')}
      >
        <Image src={DiscordIcon} width={50} height={50} alt='Discord Icon' />
      </button>
      {Array.from(serverList.values()).map((server) => {
        return (
          <button
            key={server.name}
            className='flex items-center justify-center mx-2 px-2'
            onClick={() => {
              changeServer(server, client);
            }}
          >
            {server.image ? (
              <Image
                className='rounded-full hover:rounded-xl transition-all duration-200 ease-in-out'
                src={server.image}
                width={50}
                height={50}
                alt='Server Icon'
              />
            ) : (
              <span className='text-sm'>{server.name.charAt(0)}</span>
            )}
          </button>
        );
      })}
      <Link
        href={'/?createServer=true'}
        className='flex items-center justify-center rounded-full bg-white text-green-500 hover:bg-green-500 hover:text-white hover:rounded-xl transition-all duration-200 p-2 my-2 text-2xl font-light h-12 w-12'
      >
        <span className='inline-block'>+</span>
      </Link>
      <CreateServerForm />
    </div>
  );
};

export default ServerList;
