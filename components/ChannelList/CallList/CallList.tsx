import { useDiscordContext } from '@/contexts/DiscordContext';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useCallback, useEffect, useState } from 'react';
import { ChevronRight, Speaker } from '../Icons';
import { TrackPublished } from '@stream-io/video-client/dist/src/gen/video/sfu/event/events';

export default function CallList(): JSX.Element {
  const { server, createCall } = useDiscordContext();
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
      <button
        className='flex w-full items-center justify-start mb-1'
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
      {isOpen && (
        <div className='px-2'>
          {calls.map((call) => (
            <button
              key={call.id}
              className='w-full flex items-center my-1 px-2 py-1 hover:bg-gray-200 rounded-md'
              onClick={() => console.log('Joining call', call.id)}
            >
              <Speaker className='w-6 h-6 text-gray-500 mr-2' />
              <span className=''>
                {call.state.custom.callName || 'Channel Preview'}
              </span>
            </button>
          ))}
        </div>
      )}
      <button
        onClick={async () => {
          if (!client) {
            console.log('No client');
            return;
          }
          await createCall(
            client,
            server?.name || 'Test Server',
            'Test Call 4',
            [
              'user_2dwxDiRGTaQ79kCJyldJq1DEYv8',
              '38391e52-68a0-4bc5-9d57-61d9da1adf3a',
              '5af8f586-f1da-4bdf-a636-add588765d70',
              '3dcd3e0c-d9d3-4886-ae44-ae4022a214bd',
            ]
          );
          loadAudioChannels();
        }}
      >
        Create new call
      </button>
    </div>
  );
}
