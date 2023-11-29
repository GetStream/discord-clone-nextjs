import { useDiscordContext } from '@/contexts/DiscordContext';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useChatContext } from 'stream-chat-react';

type FormState = {
  serverName: string;
  serverImage: string;
};

const CreateServerForm = () => {
  // Check if we are shown
  const params = useSearchParams();
  const showCreateServerForm = params.get('createServer');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  // Data
  const { client } = useChatContext();
  const { createServer } = useDiscordContext();
  const initialState: FormState = {
    serverName: '',
    serverImage: '',
  };

  const [formData, setFormData] = useState<FormState>(initialState);

  useEffect(() => {
    if (showCreateServerForm && dialogRef.current) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showCreateServerForm]);

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
        <label htmlFor='serverName'>Server Name</label>
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
        <label htmlFor='serverImage'>Image URL</label>
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
    createServer(client, formData.serverName, formData.serverImage);
    setFormData(initialState);
    router.replace('/');
  }
};
export default CreateServerForm;
