import { useDiscordContext } from '@/contexts/DiscordContext';
import { UserObject } from '@/model/UserObject';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import UserCard from './UserCard';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';

type FormState = {
  serverName: string;
  serverImage: string;
  users: UserObject[];
};

const CreateServerForm = () => {
  // Check if we are shown
  const params = useSearchParams();
  const showCreateServerForm = params.get('createServer');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  // Data
  const { client } = useChatContext();
  const videoClient = useStreamVideoClient();
  const { createServer } = useDiscordContext();
  const initialState: FormState = {
    serverName: '',
    serverImage: '',
    users: [],
  };

  const [formData, setFormData] = useState<FormState>(initialState);
  const [users, setUsers] = useState<UserObject[]>([]);

  const loadUsers = useCallback(async () => {
    const response = await client.queryUsers({});
    const users: UserObject[] = response.users
      .filter((user) => user.role !== 'admin')
      .map((user) => {
        return {
          id: user.id,
          name: user.name ?? user.id,
          image: user.image as string,
          online: user.online,
          lastOnline: user.last_active,
        };
      });
    if (users) setUsers(users);
  }, [client]);

  useEffect(() => {
    if (showCreateServerForm && dialogRef.current) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showCreateServerForm]);

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
      <form action={createClicked} className='flex flex-col'>
        <label className='labelTitle' htmlFor='serverName'>
          Server Name
        </label>
        <input
          type='text'
          id='serverName'
          name='serverName'
          value={formData.serverName}
          onChange={(e) =>
            setFormData({ ...formData, serverName: e.target.value })
          }
          required
        />
        <label className='labelTitle' htmlFor='serverImage'>
          Image URL
        </label>
        <input
          type='text'
          id='serverImage'
          name='serverImage'
          value={formData.serverImage}
          onChange={(e) =>
            setFormData({ ...formData, serverImage: e.target.value })
          }
          required
        />
        <h2 className='mb-2 labelTitle'>Add Users</h2>
        <div className='max-h-64 overflow-y-scroll my-4'>
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
                onChange={(event) => userBoxChecked(event.target.checked, user)}
              />
              <UserCard user={user} />
            </div>
          ))}
        </div>
        <button
          type='submit'
          className='bg-discord rounded p-3 text-white font-bold uppercase'
        >
          Create
        </button>
      </form>
    </dialog>
  );

  function userBoxChecked(checked: Boolean, user: UserObject) {
    if (checked) {
      setFormData({
        ...formData,
        users: [...formData.users, user],
      });
    } else {
      setFormData({
        ...formData,
        users: formData.users.filter((u) => u.id !== user.id),
      });
    }
  }

  function createClicked() {
    if (!videoClient) {
      console.log('[CreateServerForm] Video client not available');
      return;
    }
    createServer(
      client,
      videoClient,
      formData.serverName,
      formData.serverImage,
      formData.users.map((user) => user.id)
    );
    setFormData(initialState);
    router.replace('/');
  }
};
export default CreateServerForm;
