import {
  Bell,
  Boost,
  FaceSmile,
  FolderPlus,
  Gear,
  LeaveServer,
  Pen,
  PersonAdd,
  PlusCircle,
  Shield,
  SpeakerMuted,
} from '../Icons';

export type ListRowElement = {
  name: string;
  icon: JSX.Element;
  bottomBorder?: boolean;
  purple?: boolean;
  red?: boolean;
  reverseOrder?: boolean;
};

export const menuItems: ListRowElement[] = [
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
