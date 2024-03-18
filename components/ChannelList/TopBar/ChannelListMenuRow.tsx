import { ListRowElement } from './menuItems';

export default function ChannelListMenuRow({
  name,
  icon,
  bottomBorder = true,
  purple = false,
  red = false,
  reverseOrder = false,
}: ListRowElement): JSX.Element {
  return (
    <>
      <p
        className={`flex ${
          reverseOrder ? 'flex-row-reverse' : ''
        } justify-between items-center p-2 cursor-pointer text-gray-500 ${
          purple ? 'text-dark-discord' : ''
        } ${red ? 'text-red-500' : ''} rounded-md hover:bg-dark-discord ${
          red ? 'hover:bg-red-500' : ''
        } hover:text-white transition-colors ease-in-out duration-200`}
      >
        <span className='text-sm font-medium'>{name}</span>
        {icon}
      </p>
      {bottomBorder && <div className='my-1 mx-2 h-px bg-gray-300' />}
    </>
  );
}
