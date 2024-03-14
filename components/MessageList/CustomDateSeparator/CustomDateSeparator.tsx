import { DateSeparatorProps } from 'stream-chat-react';

export default function CustomDateSeparator(
  props: DateSeparatorProps
): JSX.Element {
  const { date } = props;

  function formatDate(date: Date): string {
    return `${date.toDateString()}`;
  }

  return (
    <div className='border-b-2 relative flex items-center justify-center my-6'>
      <span className='absolute left-auto right-auto text-xs font-semibold text-gray-500 bg-gray-50 px-2'>
        {formatDate(date)}
      </span>
    </div>
  );
}
