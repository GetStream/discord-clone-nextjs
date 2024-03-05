import { useDiscordContext } from '@/contexts/DiscordContext';
import { UserObject } from '@/model/UserObject';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { use, useCallback, useEffect, useRef, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import Link from 'next/link';
import { CloseCircle } from '../Icons';
import UserRow from './UserRow';

type FormState = {
  channelName: string;
  category: string;
  users: UserObject[];
};

export default function CreateChannelForm(): JSX.Element {
  console.log('[CreateChannelForm]');
  const params = useSearchParams();
  const showCreateChannelForm = params.get('createChannel');
  const category = params.get('category');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const { client } = useChatContext();
  const { createChannel } = useDiscordContext();
  console.log('[Category] category: ', category);
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
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    console.log(
      '[CreateChannelForm] showCreateChannelForm',
      showCreateChannelForm
    );
    if (showCreateChannelForm && dialogRef.current) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showCreateChannelForm]);

  return (
    <dialog
      className='absolute py-16 px-20 z-10 space-y-8 rounded-xl serverDialog'
      ref={dialogRef}
    >
      <Link href='/' className='absolute right-8 top-8'>
        <CloseCircle />
      </Link>
      <h2 className='text-3xl font-bold text-gray-600'>Create new channel</h2>
      <form method='dialog' className='flex flex-col'>
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
        />
        <label
          className='labelTitle flex items-center justify-between'
          htmlFor='category'
        >
          Category
        </label>
        <input
          type='text'
          id='category'
          name='category'
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        />
        <h2 className='mb-2 labelTitle'>Add Users</h2>
        <div className='max-h-64 overflow-y-scroll'>
          {users.map((user) => (
            <UserRow user={user} userChanged={userChanged} key={user.id} />
          ))}
        </div>

        <button
          type='submit'
          disabled={buttonDisabled()}
          className={`bg-discord rounded p-3 text-white font-bold uppercase ${
            buttonDisabled() ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={createClicked}
        >
          Create
        </button>
      </form>
    </dialog>
  );

  function buttonDisabled(): boolean {
    return (
      !formData.channelName || !formData.category || formData.users.length <= 1
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
    createChannel(
      client,
      formData.channelName,
      formData.category,
      formData.users.map((user) => user.id)
    );
    setFormData(initialState);
    router.replace('/');
  }
}
