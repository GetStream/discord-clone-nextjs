import { ChannelPreviewUIComponentProps } from 'stream-chat-react';

const CustomChannelPreview = (props: ChannelPreviewUIComponentProps) => {
  console.log('[CustomChannelPreview]');
  const { channel, setActiveChannel, watchers } = props;
  return (
    <button
      className='flex items-center px-2 hover:bg-gray-200 rounded-md'
      onClick={() => onChannelClick()}
    >
      <span className='italic text-xl mr-2 text-gray-500'>#</span>
      <span className='text-sm'>{channel.data?.name || 'Channel Preview'}</span>
    </button>
  );

  function onChannelClick() {
    if (setActiveChannel === undefined) return;
    setActiveChannel(channel, watchers);
  }
};

export default CustomChannelPreview;
