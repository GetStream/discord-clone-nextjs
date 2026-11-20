import Image from 'next/image';
import { UserObject } from '@/model/UserObject';

const UserCard = ({ user }: { user: UserObject }) => {
  return (
    <label className='w-full flex items-center space-x-6' htmlFor='users'>
      {user.image && (
        <Image
          src={user.image}
          width={40}
          height={40}
          alt={user.name}
          className='w-8 h-8 rounded-full'
        />
      )}
      {!user.image && (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-8 h-8'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
      )}
      <p>
        <span className='block text-gray-600'>{user.name}</span>
        {user.lastOnline && (
          <span className='text-sm text-gray-400'>
            Last online: {user.lastOnline.split('T')[0]}
          </span>
        )}
      </p>
    </label>
  );
};

export default UserCard;
