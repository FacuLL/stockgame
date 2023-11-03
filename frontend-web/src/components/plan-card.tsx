'use client'

import { Card } from 'flowbite-react';
import { ReactNode } from 'react';

export default function PlanCard(props: {children: ReactNode, price: number, symbol: string, title: string}) {
  return (
    <Card className='max-w-sm'>
      <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{props.title}</h5>
      <div className="flex items-baseline text-gray-900 dark:text-white">
        <span className="text-3xl font-semibold">{props.symbol}</span>
        <span className="text-5xl font-extrabold tracking-tight">{props.price}</span>
        <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">/mes</span>
      </div>
      <ul className="my-7 space-y-5">
        {props.children}
      </ul>
      <button
        type="button"
        className="inline-flex w-full justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-900"
      >
        Elegir
      </button>
    </Card>
  );
}
