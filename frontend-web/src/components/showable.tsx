import { ReactNode } from "react";


export default function Showable(props: {children: ReactNode, show: boolean}) {
    if (props.show) return props.children;
    return;
}