import { useDiscordContext } from '@/contexts/DiscordContext';
import { UserObject } from '@/model/UserObject';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { CloseMark } from '../ChannelList/Icons';
import UserRow from '../ChannelList/CreateChannelForm/UserRow';

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
    <dialog className='absolute z-10 space-y-2 rounded-xl' ref={dialogRef}>
      <div className='w-full flex items-center justify-between py-8 px-6'>
        <h2 className='text-3xl font-semibold text-gray-600'>
          Create new server
        </h2>
        <Link href='/'>
          <CloseMark className='w-10 h-10 text-gray-400' />
        </Link>
      </div>
      <form method='dialog' className='flex flex-col space-y-2 px-6'>
        <label className='labelTitle' htmlFor='serverName'>
          Server Name
        </label>
        <div className='flex items-center bg-gray-100'>
          <span className='text-2xl p-2 text-gray-500'>#</span>
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
        </div>
        <label className='labelTitle' htmlFor='serverImage'>
          Image URL
        </label>
        <div className='flex items-center bg-gray-100'>
          <span className='text-2xl p-2 text-gray-500'>#</span>
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
        </div>
        <h2 className='mb-2 labelTitle'>Add Users</h2>
        <div className='max-h-64 overflow-y-scroll'>
          {users.map((user) => (
            <UserRow user={user} userChanged={userChanged} key={user.id} />
          ))}
        </div>
      </form>
      <div className='flex space-x-6 items-center justify-end p-6 bg-gray-200'>
        <Link href={'/'} className='font-semibold text-gray-500'>
          Cancel
        </Link>
        <button
          type='submit'
          disabled={buttonDisabled()}
          className={`bg-discord rounded py-2 px-4 text-white font-bold uppercase ${
            buttonDisabled() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={createClicked}
        >
          Create Server
        </button>
      </div>
    </dialog>
  );

  function buttonDisabled(): boolean {
    return (
      !formData.serverName ||
      !formData.serverImage ||
      formData.users.length <= 1
    );
  }

  function userChanged(user: UserObject, checked: boolean) {
    if (checked) {
      setFormData({
        ...formData,
        users: [...formData.users, user],
      });
    } else {
      setFormData({
        ...formData,
        users: formData.users.filter((thisUser) => thisUser.id !== user.id),
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
