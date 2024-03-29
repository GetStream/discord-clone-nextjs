import {
  Call,
  StreamCall,
  useStreamVideoClient,
} from '@stream-io/video-react-sdk';
import { useCallback, useEffect, useState } from 'react';
import CallLayout from './CallLayout';

export default function MyCall({ callId }: { callId: string }): JSX.Element {
  const [call, setCall] = useState<Call | undefined>(undefined);
  const client = useStreamVideoClient();

  const [joining, setJoining] = useState(false);

  const createCall = useCallback(async () => {
    const callToCreate = client?.call('default', callId);
    await callToCreate?.camera.disable();
    await callToCreate?.join({ create: true });
    setCall(callToCreate);
    setJoining(false);
  }, [client, callId]);

  useEffect(() => {
    if (!client) {
      console.error('No client in MyCall component');
      return;
    }

    if (!call) {
      if (joining) {
        createCall();
      } else {
        setJoining(true);
      }
    }
  }, [call, client, createCall, joining]);

  if (!call) {
    return (
      <div className='w-full h-full text-xl font-semibold flex items-center justify-center animate-pulse'>
        Joining call ...
      </div>
    );
  }

  return (
    <StreamCall call={call}>
      <CallLayout />
    </StreamCall>
  );
}
