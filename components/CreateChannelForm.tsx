import { useDiscordContext } from '@/contexts/DiscordContext';
import { UserObject } from '@/model/UserObject';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import Image from 'next/image';
import Link from 'next/link';

type FormState = {
  channelName: string;
  category: string;
  users: UserObject[];
};

const CreateChannelForm = () => {
  console.log('[CreateChannelForm]');
  const params = useSearchParams();
  const showCreateChannelForm = params.get('createChannel');
  const category = params.get('category');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const [newCategoryActive, setNewCategoryActive] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');

  const { client } = useChatContext();
  const { createChannel, channelsByCategories } = useDiscordContext();
  const initialState: FormState = {
    channelName: '',
    category: category ?? '',
    users: [],
  };

  const [formData, setFormData] = useState<FormState>(initialState);
  const [users, setUsers] = useState<UserObject[]>([]);

  const loadUsers = useCallback(async () => {
    const response = await fetch('/api/users');
    const data = (await response.json())?.data as UserObject[];
    if (data) setUsers(data);
  }, []);

  useEffect(() => {
    if (showCreateChannelForm && dialogRef.current) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showCreateChannelForm]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <dialog
      className='absolute py-16 px-20 z-10 space-y-8 rounded-xl serverDialog'
      ref={dialogRef}
    >
      <Link href='/' className='absolute right-8 top-8'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-8 h-8 text-gray-500 hover:text-black hover:font-bold'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      </Link>
      <h2 className='text-3xl font-bold text-gray-600'>Create new server</h2>
      <form method='dialog' action={createClicked} className='flex flex-col'>
        <label className='labelTitle' htmlFor='channelName'>
          Channel Name
        </label>
        <input
          type='text'
          id='channelName'
          name='channelName'
          value={formData.channelName}
          onChange={(e) =>
            setFormData({ ...formData, channelName: e.target.value })
          }
          required
        />
        <label
          className='labelTitle flex items-center justify-between'
          htmlFor='category'
        >
          Category
          {!newCategoryActive && (
            <button
              className='text-discord font-bold uppercase'
              onClick={() => setNewCategoryActive(true)}
            >
              New
            </button>
          )}
          {newCategoryActive && (
            <button
              className='py-1 px-2 bg-discord text-white rounded-md font-bold uppercase'
              onClick={() => newCategoryAdded}
            >
              Add
            </button>
          )}
        </label>
        {newCategoryActive && (
          <input
            type='text'
            id='new-category'
            name='new-category'
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        )}
        <select name='category' id='category' required>
          <option value={category ?? ''}>
            {category ?? 'Select a category'}
          </option>
          {Array.from(channelsByCategories.keys())
            .filter((value) => value !== category)
            .map((thisCategory: string) => (
              <option key={thisCategory} value={thisCategory}>
                {thisCategory}
              </option>
            ))}
        </select>
        <h2 className='mb-2 labelTitle'>Add Users</h2>
        {users.map((user) => (
          <div
            key={user.id}
            className='flex items-center justify-start w-full space-x-6 my-2'
          >
            <input
              type='checkbox'
              id={user.id}
              name={user.id}
              className='w-4 h-4 mb-0'
              onChange={() => {}}
            ></input>
            <label
              className='w-full flex items-center space-x-6'
              htmlFor='users'
            >
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
          </div>
        ))}

        <button
          type='submit'
          className='bg-discord rounded p-3 text-white font-bold uppercase'
        >
          Create
        </button>
      </form>
    </dialog>
  );

  function createClicked() {
    createChannel(
      client,
      formData.channelName,
      category || 'Category',
      formData.users.map((user) => user.id)
    );
    setFormData(initialState);
    router.replace('/');
  }

  function newCategoryAdded() {
    setFormData({ ...formData, category: newCategory });
    setNewCategory('');
    setNewCategoryActive(false);
  }
};

export default CreateChannelForm;
