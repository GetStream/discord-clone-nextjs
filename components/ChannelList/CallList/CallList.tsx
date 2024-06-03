import { useDiscordContext } from '@/contexts/DiscordContext';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useCallback, useEffect, useState } from 'react';
import { ChevronRight, PlusIcon, Speaker } from '../Icons';
import Link from 'next/link';

export default function CallList(): JSX.Element {
  const { server, callId, setCall } = useDiscordContext();
  const client = useStreamVideoClient();

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [calls, setCalls] = useState<Call[]>([]);

  const loadAudioChannels = useCallback(async () => {
    const callsRequest = await client?.queryCalls({
      filter_conditions: {
        'custom.serverName': server?.name || 'Test Server',
      },
      sort: [{ field: 'created_at', direction: 1 }],
      watch: true,
    });
    if (callsRequest?.calls) {
      setCalls(callsRequest?.calls);
    }
  }, [client, server]);

  useEffect(() => {
    loadAudioChannels();
  }, [loadAudioChannels]);

  return (
    <div className='w-full my-2'>
      <div className='flex text-gray-500 items-center mb-2 pr-2'>
        <button
          className='flex w-full items-center justify-start px-2'
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        >
          <div
            className={`${
              isOpen ? 'rotate-90' : ''
            } transition-all ease-in-out duration-200`}
          >
            <ChevronRight />
          </div>
          <h2 className='inline-block uppercase text-sm font-bold px-2'>
            Voice Channels
          </h2>
        </button>
        <Link
          className=''
          href={`/?createChannel=true&isVoice=true&category=Voice Channels`}
        >
          <PlusIcon />
        </Link>
      </div>
      {isOpen && (
        <div className='px-2'>
          {calls.map((call) => (
            <button
              key={call.id}
              className='w-full flex items-center my-1 px-2 py-1 hover:bg-gray-200 rounded-md'
              onClick={() => {
                setCall(call.id);
              }}
            >
              <Speaker className='w-5 h-5 text-gray-500 mr-2' />
              <span
                className={`text-sm ${call.id === callId ? 'font-bold' : ''}`}
              >
                {call.state.custom.callName || 'Channel Preview'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
