'use client';

import { Avatar, Dropdown } from 'flowbite-react';
import DropdownLink from './dropdown-link';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function UserDropdown(props: {avatar: string, name: string, email:string, className: string}) {
    const router = useRouter();
    let logout = () => {
        signOut({ redirect: false }).then(() => router.push("/"));
    }
    return (
        <Dropdown
        inline
        label={<Avatar status="online" statusPosition="bottom-left" alt="User settings" className={props.className} img={props.avatar} rounded/>}
        >
        <Dropdown.Header>
            <span className="block text-sm">
            {props.name}
            </span>
            <span className="block truncate text-sm font-medium">
            {props.email}
            </span>
        </Dropdown.Header>
        <DropdownLink href='/account'>
            Mi cuenta
        </DropdownLink>
        <Dropdown.Divider />
        <Dropdown.Item onClick={() => logout()}>
            Cerrar Sesión
        </Dropdown.Item>
        </Dropdown>
    )
}