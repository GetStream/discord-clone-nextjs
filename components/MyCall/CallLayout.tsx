import { useDiscordContext } from '@/contexts/DiscordContext';
import { CallingState } from '@stream-io/video-client';
import {
  useCallStateHooks,
  StreamTheme,
  SpeakerLayout,
  CallControls,
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';

export default function CallLayout(): JSX.Element {
  const { setCall } = useDiscordContext();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const participantCount = useParticipantCount();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme>
      <h2>Participants: {participantCount}</h2>
      <SpeakerLayout participantsBarPosition='bottom' />
      <CallControls
        onLeave={() => {
          setCall(undefined);
        }}
      />
    </StreamTheme>
  );
}
