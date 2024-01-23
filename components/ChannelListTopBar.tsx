import { useState } from 'react';
import {
  Bell,
  Boost,
  ChevronDown,
  CloseIcon,
  FaceSmile,
  FolderPlus,
  Gear,
  LeaveServer,
  Pen,
  PersonAdd,
  PlusCircle,
  Shield,
  SpeakerMuted,
} from './Icons';

type ListRowElement = {
  name: string;
  icon: JSX.Element;
  bottomBorder?: boolean;
  purple?: boolean;
  red?: boolean;
};

export default function ChannelListTopBar({
  serverName,
}: {
  serverName: string;
}): JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuOptions: ListRowElement[] = [
    { name: 'Server Boost', icon: <Boost />, bottomBorder: true },
    {
      name: 'Invite People',
      icon: <PersonAdd />,
      bottomBorder: false,
      purple: true,
    },
    { name: 'Server Settings', icon: <Gear />, bottomBorder: false },
    { name: 'Create Channel', icon: <PlusCircle />, bottomBorder: false },
    { name: 'Create Category', icon: <FolderPlus />, bottomBorder: false },
    { name: 'App Directory', icon: <FaceSmile />, bottomBorder: true },
    { name: 'Notification Settings', icon: <Bell />, bottomBorder: false },
    { name: 'Privacy Settings', icon: <Shield />, bottomBorder: true },
    { name: 'Edit Server Profile', icon: <Pen />, bottomBorder: false },
    { name: 'Hide Muted Channels', icon: <SpeakerMuted />, bottomBorder: true },
    {
      name: 'Leave Server',
      icon: <LeaveServer />,
      bottomBorder: false,
      red: true,
    },
  ];

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
        <div className='absolute w-full p-2'>
          <div className='w-full bg-white p-2 shadow-lg rounded-md'>
            {menuOptions.map((option) => (
              <button
                key={option.name}
                className='w-full'
                onClick={() => setMenuOpen(false)}
              >
                <ListRow {...option} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ListRow({
  name,
  icon,
  bottomBorder = true,
  purple = false,
  red = false,
}: ListRowElement): JSX.Element {
  return (
    <>
      <p
        className={`flex items-center justify-between p-2 cursor-pointer text-gray-500 ${
          purple ? 'text-dark-discord' : ''
        } ${red ? 'text-red-500' : ''} rounded-md hover:bg-dark-discord ${
          red ? 'hover:bg-red-500' : ''
        } hover:text-white transition-colors ease-in-out duration-200`}
      >
        <span className='text-sm font-medium '>{name}</span>
        {icon}
      </p>
      {bottomBorder && <div className='my-1 mx-2 h-px bg-gray-300' />}
    </>
  );
}
