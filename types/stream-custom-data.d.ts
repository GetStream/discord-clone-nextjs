import 'stream-chat';
import type { DefaultChannelData } from 'stream-chat-react';

declare module 'stream-chat' {
  interface CustomChannelData extends DefaultChannelData {
    data?: {
      server?: string;
      category?: string;
      image?: string;
    };
  }

  interface CustomUserData {
    imageUrl?: string;
  }
}
