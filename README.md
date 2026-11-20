![Discord-Clone-Part1-2400x1350px](https://github.com/GetStream/discord-clone-nextjs/assets/12433593/3c15c77d-7c7c-45fc-b7ba-a26ae20a2842)

# Discord Clone using NextJS, TailwindCSS, and Stream

This repository accompanies the series of blog posts published on the Stream Blog about creating a Discord clone using [NextJS](https://nextjs.org), [TailwindCSS](https://tailwindcss.com), and the Stream [Chat](https://getstream.io/chat/docs/) and [Video](https://getstream.io/video/docs/) SDKs.

The series has five posts:

- [Part 1: Setup Project](https://getstream.io/blog/discord-clone-project-setup/)
- [Part 2: General Layout and Server List](https://getstream.io/blog/discord-clone-server-list/)
- [Part 3: Channel List UI](https://getstream.io/blog/discord-clone-channel-list/)
- [Part 4: Message List UI](https://getstream.io/blog/discord-clone-message-list/)
- [Part 5: Adding video and audio calling](https://getstream.io/blog/discord-clone-audio-video/)

The project uses `stream-chat` v10, `stream-chat-react` v15, `@stream-io/video-react-sdk` and `@stream-io/node-sdk` (for the API routes).

---

## Running the project

### Prerequisites

First, a machine running [Node.js](https://nodejs.org/en) and the option to clone the repository. The rest of the setup is explained in [Part 1](https://getstream.io/blog/discord-clone-project-setup/).

Second, an account with Stream. We have a [free tier](https://getstream.io/pricing/#chat), and we can create an account for free using [this link](https://http://getstream.io/try-for-free/).

### Running locally

The first thing to do is install dependencies:

```bash
npm install
# or
yarn
```

Then we can run the project on our machine in development mode:

```bash
npm run dev
# or
yarn dev
```

## Use the Stream SDKs yourself

You can get started with the Stream SDKs today [for free](https://http://getstream.io/try-for-free/).

Find our React documentation here:

- [Chat SDK](https://getstream.io/chat/sdk/react/)
- [Video and Audio SDK](https://getstream.io/video/docs/react/)
