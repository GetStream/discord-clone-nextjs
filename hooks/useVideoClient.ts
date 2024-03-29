import { StreamVideoClient } from '@stream-io/video-client';
import { useEffect, useState } from 'react';
import { UseClientOptions } from './useClient';

export const useVideoClient = ({
  apiKey,
  user,
  tokenOrProvider,
}: UseClientOptions): StreamVideoClient | undefined => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const streamVideoClient = new StreamVideoClient({ apiKey });
    // prevents application from setting stale client (user changed, for example)
    let didUserConnectInterrupt = false;

    const videoConnectionPromise = streamVideoClient
      .connectUser(user, tokenOrProvider)
      .then(() => {
        if (!didUserConnectInterrupt) {
          setVideoClient(streamVideoClient);
        }
      });

    return () => {
      didUserConnectInterrupt = true;
      setVideoClient(undefined);
      // wait for connection to finish before initiating closing sequence
      videoConnectionPromise
        .then(() => streamVideoClient.disconnectUser())
        .then(() => {
          console.log('video connection closed');
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- should re-run only if user.id changes
  }, [apiKey, user.id, tokenOrProvider]);

  return videoClient;
};
