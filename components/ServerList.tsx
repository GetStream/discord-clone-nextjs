import { useChatContext } from 'stream-chat-react';
import Image from 'next/image';
import DiscordIcon from '../public/discord.svg';
import { useState } from 'react';
import { DiscordServer } from '@/app/page';
import { useDiscordContext } from '@/contexts/DiscordContext';
import CreateServerForm from './CreateServerForm';
import Link from 'next/link';

const ServerList = () => {
  const { client, channels } = useChatContext();
  const { changeServer } = useDiscordContext();
  const [createServerOpened, setCreateServerOpened] = useState(false);
  const serverList: Set<DiscordServer> = new Set(
    channels
      .map((channel) => {
        return {
          name: (channel.data?.data?.server as string) ?? 'Unknown',
          image: channel.data?.data?.image,
        };
      })
      .filter((server) => server.name !== 'Unknown')
  );

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
              changeServer(server);
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
        onClick={() => addServerClicked()}
      >
        <span className='inline-block'>+</span>
      </Link>
      <CreateServerForm />
    </div>
  );

  async function addServerClicked() {
    setCreateServerOpened(true);
    console.log('Add Server Clicked');
  }
};

export default ServerList;
