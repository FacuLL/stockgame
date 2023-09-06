'use client'

import { Dropdown } from "flowbite-react"
import Link from "next/link";

export default function DropdownLink(props: {children: string, href: string}) {
    return (
      <Link href={props.href}>
        <Dropdown.Item>
            {props.children}
        </Dropdown.Item>
      </Link>
    )
}