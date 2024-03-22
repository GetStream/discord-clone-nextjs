import Image from 'next/image';
import { useState } from 'react';
import { Gear, LeaveServer, Mic, Speaker } from '../Icons';
import { useChatContext } from 'stream-chat-react';
import { useClerk } from '@clerk/nextjs';
import ChannelListMenuRow from '../TopBar/ChannelListMenuRow';

export default function ChannelListBottomBar(): JSX.Element {
  const { client } = useChatContext();
  const [micActive, setMicActive] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { signOut } = useClerk();

  return (
    <div className='mt-auto p-2 bg-light-gray w-full flex items-center space-x-3 relative'>
      <button
        className='flex flex-1 items-center space-x-2 p-1 pr-2 rounded-md hover:bg-hover-gray'
        onClick={() => setMenuOpen((currentValue) => !currentValue)}
      >
        {client.user?.image && (
          <div
            className={`relative ${client.user?.online ? 'online-icon' : ''}`}
          >
            <Image
              src={client.user?.image ?? 'https://thispersondoesnotexist.com/'}
              alt='User image'
              width={36}
              height={36}
              className='rounded-full'
            />
          </div>
        )}
        <p className='flex flex-col items-start space-y-1'>
          <span className='block max-w-24 text-gray-700 text-sm font-medium -mb-1.5 tracking-tight text-ellipsis overflow-x-clip'>
            {client.user?.name}
          </span>
          <span className='text-xs text-gray-500 inline-block'>
            {client.user?.online ? 'Online' : 'Offline'}
          </span>
        </p>
      </button>
      <button
        className={`w-7 h-7 p-1 flex items-center justify-center relative rounded-lg hover:bg-gray-300 transition-all duration-100 ease-in-out ${
          !micActive ? 'inactive-icon text-red-400' : 'text-gray-700'
        }`}
        onClick={() => setMicActive((currentValue) => !currentValue)}
      >
        <Mic />
      </button>
      <button
        className={`w-7 h-7 p-1 flex items-center justify-center relative rounded-lg hover:bg-gray-300 transition-all duration-100 ease-in-out ${
          !audioActive ? 'inactive-icon text-red-400' : 'text-gray-700'
        }`}
        onClick={() => setAudioActive((currentValue) => !currentValue)}
      >
        <Speaker />
      </button>
      <button className='w-7 h-7 p-1 flex items-center justify-center relative rounded-md hover:bg-gray-300 transition-all duration-100 ease-in-out text-gray-700'>
        <Gear className='w-full h-full' />
      </button>
      {menuOpen && (
        <button
          className='absolute -top-12 -left-1 w-52 p-2 bg-white rounded-md shadow-md'
          onClick={() => signOut()}
        >
          <ChannelListMenuRow
            name='Sign out'
            icon={<LeaveServer />}
            bottomBorder={false}
            red
          />
        </button>
      )}
    </div>
  );
}
