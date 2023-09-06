'use client'

import { Navbar } from "flowbite-react"
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation'

export default function NavbarLink(props: {children: string, href: string}) {
    const pathname = usePathname();

    return (
      <Link href={props.href}>
        <Navbar.Link className="lg:mx-5 rounded hover:cursor-pointer" active={props.href == pathname} as='p'>
          {props.children}
        </Navbar.Link>
      </Link>
    )
}