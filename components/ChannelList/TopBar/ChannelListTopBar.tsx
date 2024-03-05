import { useState } from 'react';
import { ChevronDown, CloseIcon } from '../Icons';
import ChannelListMenuRow from './ChannelListMenuRow';
import { menuItems } from './menuItems';

export default function ChannelListTopBar({
  serverName,
}: {
  serverName: string;
}): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='w-full relative'>
      <button
        className={`flex w-full items-center justify-between p-4 border-b-2 ${
          menuOpen ? 'bg-gray-300' : ''
        } border-gray-300 hover:bg-gray-300`}
        onClick={() => setMenuOpen((currentValue) => !currentValue)}
      >
        <h2 className='text-lg font-bold text-gray-700'>{serverName}</h2>
        {menuOpen && <CloseIcon />}
        {!menuOpen && <ChevronDown />}
      </button>

      {menuOpen && (
        <div className='absolute w-full p-2 z-10'>
          <div className='w-full bg-white p-2 shadow-lg rounded-md'>
            {menuItems.map((option) => (
              <button
                key={option.name}
                className='w-full'
                onClick={() => setMenuOpen(false)}
              >
                <ChannelListMenuRow {...option} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
