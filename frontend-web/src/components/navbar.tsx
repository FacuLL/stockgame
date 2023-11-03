'use client';

import { Button, DarkThemeToggle, Navbar, Spinner } from 'flowbite-react';
import NavbarLink from './navbar-link';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserDropdown from './user-dropdown';

export default function DefaultNavbar() {
  const router = useRouter();
  return (
    <Navbar fluid>
      <Navbar.Brand onClick={() => router.push('/')} className='cursor-pointer'>
        <img
          alt="Stockgame Logo"
          className="mr-3 h-6 sm:h-7 lg:h-9"
          src="/logo.png"
        />
        <span className="hidden lg:block self-center whitespace-nowrap text-lg lg:text-xl font-semibold text-black dark:text-white">
          Stockgame
        </span>
      </Navbar.Brand>
      <Navbar.Toggle className="ml-2" />
      <Navbar.Collapse>
        <div className="flex flex-col md:flex-row md:items-center">
          <NavbarLink href='/'>Inicio</NavbarLink>
          <NavbarLink href='/login'>Acerca de</NavbarLink>
          <NavbarLink href='/login'>Servicio</NavbarLink>
          <NavbarLink href='/plans'>Precios</NavbarLink>
          <NavbarLink href='/login'>Contacto</NavbarLink>
        </div>
        <div className="flex md:order-2 sm:divide-x divide-gray-300 mt-2 md:mt-0 justify-center">
          <DarkThemeToggle className='mr-2' />
          {
            // { 
            //   'authenticated':  
            //     <UserDropdown avatar={data?.user.image} name={data?.user.name} email={data?.user.institution?.email || data?.user.basicuser?.email} className='ml-3'></UserDropdown>,
            //   'unauthenticated': 
            //     <div className='flex items-center'>
            //       <NavbarLink href='/login'>Iniciar sesión</NavbarLink>
            //       <Link href="/register"><Button>Empezá ya</Button></Link>
            //     </div>,
            //   'loading':
            //     <div className='flex items-center px-3'>
            //       <Spinner className='ml-2'></Spinner>
            //     </div>
            //   }[status]
          }
        </div>
      </Navbar.Collapse>
    </Navbar>
  )
}


