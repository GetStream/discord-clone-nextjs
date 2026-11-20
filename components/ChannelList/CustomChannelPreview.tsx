import {
  ChannelListItemUIProps,
  useWorkspaceNavigation,
} from 'stream-chat-react';

const CustomChannelPreview = (props: ChannelListItemUIProps) => {
  const { channel } = props;
  const { openChannel } = useWorkspaceNavigation();
  return (
    <div
      className={`flex items-center mx-2 ${
        props.channel.countUnread() > 0 ? 'channel-container' : ''
      }`}
    >
      <button
        className='w-full flex items-center px-2 hover:bg-gray-200 rounded-md'
        onClick={() => openChannel(channel)}
      >
        <span className='italic text-xl mr-2 text-gray-500'>#</span>
        <span className='text-sm'>
          {channel.data?.custom?.name || 'Channel Preview'}
        </span>
      </button>
    </div>
  );
};

export default CustomChannelPreview;
