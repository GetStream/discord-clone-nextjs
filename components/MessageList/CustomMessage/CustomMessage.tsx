import { Avatar, useMessageContext } from 'stream-chat-react';
import Image from 'next/image';

export default function CustomMessage(): JSX.Element {
  const { message } = useMessageContext();
  return (
    <div className='flex space-x-2 my-4'>
      <Image
        className='rounded-full aspect-square object-cover w-10 h-10'
        width={40}
        height={40}
        src={message.user?.image || 'https://getstream.io/random_png/'}
        alt='User avatar'
      />
      <div>
        <div className='space-x-2'>
          <span className='font-semibold text-sm text-black'>
            {message.user?.name}
          </span>
          {message.updated_at && (
            <span className='text-xs text-gray-600'>
              {formatDate(message.updated_at)}
            </span>
          )}
        </div>
        <p className='text-sm text-gray-700'>{message.text}</p>
      </div>
    </div>
  );

  function formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }
    return `${date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })}`;
  }
}
