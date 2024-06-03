import { UserObject } from '@/model/UserObject';
import { useDiscordContext } from '@/contexts/DiscordContext';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import Link from 'next/link';
import { CloseMark, Speaker } from '../Icons';
import UserRow from './UserRow';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';

type FormState = {
  channelType: 'text' | 'voice';
  channelName: string;
  category: string;
  users: UserObject[];
};

export default function CreateChannelForm(): JSX.Element {
  const params = useSearchParams();
  const showCreateChannelForm = params.get('createChannel');

  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const { client } = useChatContext();
  const videoClient = useStreamVideoClient();
  const { server, createChannel, createCall } = useDiscordContext();
  const initialState: FormState = {
    channelType: 'text',
    channelName: '',
    category: '',
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
    const category = params.get('category');
    const isVoice = params.get('isVoice');
    setFormData({
      channelType: isVoice ? 'voice' : 'text',
      channelName: '',
      category: category ?? '',
      users: [],
    });
  }, [setFormData, params]);

  useEffect(() => {
    if (showCreateChannelForm && dialogRef.current) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showCreateChannelForm]);

  return (
    <dialog className='absolute z-10 space-y-2 rounded-xl' ref={dialogRef}>
      <div className='w-full flex items-center justify-between py-8 px-6'>
        <h2 className='text-3xl font-semibold text-gray-600'>Create Channel</h2>
        <Link href='/'>
          <CloseMark className='w-10 h-10 text-gray-400' />
        </Link>
      </div>
      <form method='dialog' className='flex flex-col space-y-4 px-6'>
        <div className='space-y-4'>
          <h3 className='labelTitle'>Channel Type</h3>
          <div className='w-full flex space-x-4 items-center bg-gray-100 px-4 py-2 rounded-md'>
            <label
              htmlFor='text'
              className='flex flex-1 items-center space-x-6'
            >
              <span className='text-4xl text-gray-400'>#</span>
              <div>
                <p className='text-lg text-gray-700 font-semibold'>Text</p>
                <p className='text-gray-500'>
                  Send messages, images, GIFs, emoji, opinions, and puns
                </p>
              </div>
            </label>
            <input
              type='radio'
              id='text'
              name='channelType'
              value='text'
              checked={formData.channelType === 'text'}
              onChange={() => setFormData({ ...formData, channelType: 'text' })}
            />
          </div>
          <div className='w-full flex space-x-4 items-center bg-gray-100 px-4 py-2 rounded-md'>
            <label
              htmlFor='voice'
              className='flex flex-1 items-center space-x-4'
            >
              <Speaker className='text-gray-400 w-7 h-7' />
              <div>
                <p className='text-lg text-gray-700 font-semibold'>Voice</p>
                <p className='text-gray-500'>
                  Hang out together with voice, video, and screen share
                </p>
              </div>
            </label>
            <input
              type='radio'
              id='voice'
              name='channelType'
              value='voice'
              checked={formData.channelType === 'voice'}
              onChange={() =>
                setFormData({ ...formData, channelType: 'voice' })
              }
            />
          </div>
        </div>
        <label className='labelTitle' htmlFor='channelName'>
          Channel Name
        </label>
        <div className='flex items-center bg-gray-100'>
          <span className='text-2xl p-2 text-gray-500'>#</span>
          <input
            type='text'
            id='channelName'
            name='channelName'
            value={formData.channelName}
            onChange={(e) =>
              setFormData({ ...formData, channelName: e.target.value })
            }
          />
        </div>
        <label
          className='labelTitle flex items-center justify-between'
          htmlFor='category'
        >
          Category
        </label>
        <div className='flex items-center bg-gray-100'>
          <span className='text-2xl p-2 text-gray-500'>#</span>
          <input
            type='text'
            id='category'
            name='category'
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
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
          Create Channel
        </button>
      </div>
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
    switch (formData.channelType) {
      case 'text':
        createChannel(
          client,
          formData.channelName,
          formData.category,
          formData.users.map((user) => user.id)
        );
      case 'voice':
        if (videoClient && server) {
          createCall(
            videoClient,
            server,
            formData.channelName,
            formData.users.map((user) => user.id)
          );
        }
    }
    setFormData(initialState);
    router.replace('/');
  }
}
