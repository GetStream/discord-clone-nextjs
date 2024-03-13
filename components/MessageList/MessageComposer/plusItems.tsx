import { Apps, FolderPlus, Thread } from '@/components/ChannelList/Icons';
import { ListRowElement } from '@/components/ChannelList/TopBar/menuItems';

export const plusItems: ListRowElement[] = [
  {
    name: 'Upload a File',
    icon: <FolderPlus />,
    bottomBorder: false,
    reverseOrder: true,
  },
  {
    name: 'Create Thread',
    icon: <Thread />,
    bottomBorder: false,
    reverseOrder: true,
  },
  { name: 'Use Apps', icon: <Apps />, bottomBorder: false, reverseOrder: true },
];
