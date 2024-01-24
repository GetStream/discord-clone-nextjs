import {
  ChannelPreviewUIComponentProps,
  useChatContext,
} from 'stream-chat-react';

const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
  console.log('[CustomChannelPreview]');
  const { channel } = props;
  const { setActiveChannel } = useChatContext();
  return (
    <button
      className='w-full flex items-center px-2 hover:bg-gray-200 rounded-md'
      onClick={() => setActiveChannel(channel)}
    >
      <span className='italic text-xl mr-2 text-gray-500'>#</span>
      <span className='text-sm'>{channel.data?.name || 'Channel Preview'}</span>
    </button>
  );
};

export default CustomChannelPreview;
