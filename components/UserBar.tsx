import Image from 'next/image';
import { useState } from 'react';

export default function UserBar(): JSX.Element {
  const [micActive, setMicActive] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

  return (
    <div className='mt-auto p-2 bg-gray-200 w-full flex items-center justify-between'>
      <div className='relative online-icon'>
        <Image
          src={'https://thispersondoesnotexist.com/'}
          alt='User image'
          width={40}
          height={40}
          className='rounded-full'
        />
      </div>
      <p>
        <span className='block text-gray-700 -mb-1.5'>Stefan</span>
        <span className='text-sm text-gray-400 inline-block'>Online</span>
      </p>
      <button
        className={`w-7 h-7 p-1 flex items-center justify-center relative rounded-lg hover:bg-gray-300 transition-all duration-100 ease-in-out ${
          !micActive ? 'inactive-icon text-red-400' : 'text-gray-700'
        }`}
        onClick={() => setMicActive((currentValue) => !currentValue)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='w-full h-full'
        >
          <path d='M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z' />
          <path d='M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z' />
        </svg>
      </button>
      <button
        className={`w-7 h-7 p-1 flex items-center justify-center relative rounded-lg hover:bg-gray-300 transition-all duration-100 ease-in-out ${
          !audioActive ? 'inactive-icon text-red-400' : 'text-gray-700'
        }`}
        onClick={() => setAudioActive((currentValue) => !currentValue)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='w-full h-full'
        >
          <path d='M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z' />
          <path d='M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z' />
        </svg>
      </button>
      <button className='w-7 h-7 p-1 flex items-center justify-center relative rounded-lg hover:bg-gray-300 transition-all duration-100 ease-in-out text-gray-700'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='w-full h-full'
        >
          <path
            fillRule='evenodd'
            d='M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 01-.517.608 7.45 7.45 0 00-.478.198.798.798 0 01-.796-.064l-.453-.324a1.875 1.875 0 00-2.416.2l-.243.243a1.875 1.875 0 00-.2 2.416l.324.453a.798.798 0 01.064.796 7.448 7.448 0 00-.198.478.798.798 0 01-.608.517l-.55.092a1.875 1.875 0 00-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 01-.064.796l-.324.453a1.875 1.875 0 00.2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 01.796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 01.517-.608 7.52 7.52 0 00.478-.198.798.798 0 01.796.064l.453.324a1.875 1.875 0 002.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 01-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 001.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 01-.608-.517 7.507 7.507 0 00-.198-.478.798.798 0 01.064-.796l.324-.453a1.875 1.875 0 00-.2-2.416l-.243-.243a1.875 1.875 0 00-2.416-.2l-.453.324a.798.798 0 01-.796.064 7.462 7.462 0 00-.478-.198.798.798 0 01-.517-.608l-.091-.55a1.875 1.875 0 00-1.85-1.566h-.344zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </div>
  );
}
