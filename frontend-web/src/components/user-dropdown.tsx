'use client';

import { Avatar, Dropdown } from 'flowbite-react';
import DropdownLink from './dropdown-link';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AuthContext } from '@/app/AuthContext';

export default function UserDropdown(props: {avatar: string, name: string, email:string, className: string}) {
    const router = useRouter();
    const { logout } = useContext(AuthContext);
    let onLogout = async () => {
        try {
            if (await logout()) router.push('/login');
        }
        catch(err) {
            console.log(err);
        }
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
        <Dropdown.Item onClick={() => onLogout()}>
            Cerrar Sesión
        </Dropdown.Item>
        </Dropdown>
    )
}