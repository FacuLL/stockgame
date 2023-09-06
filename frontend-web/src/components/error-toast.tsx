'use client';

import { IconX } from '@tabler/icons-react';
import { Toast } from 'flowbite-react';

export default function ErrorToast(props: {children: string, className: string}) {
  return (
    <Toast className={props.className + ' absolute bottom-0 right-0 m-3'} >
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
        <IconX className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">
        {props.children}
      </div>
      <Toast.Toggle />
    </Toast>
  )
}