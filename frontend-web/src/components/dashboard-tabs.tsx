import { IconArrowsExchange, IconBriefcase, IconHome } from "@tabler/icons-react";
import { Tabs, TabsComponent } from "flowbite-react";
import { usePathname, useRouter } from "next/navigation";


export default function DashboardTabs(props: {gameid: any}) {
    const router = useRouter();
    const pathname = usePathname();
    const tabs = ['', '/inventory', '/transactions']
    const goToTab = (tab: number) => {
        let route = tabs[tab];
        router.push('/dashboard/' + props.gameid + route);
    }
    const isActive = (route: string) => {
        return pathname == '/dashboard/' + props.gameid + route;
    }
    return (
        <TabsComponent aria-label="Tabs with icons" style="underline" className="mt-1" onActiveTabChange={(tab) => goToTab(tab)}>
            <Tabs.Item active={isActive('')} title="Inicio" icon={IconHome} />
            <Tabs.Item active={isActive('/inventory')} title="Inventario" icon={IconBriefcase} />
            <Tabs.Item active={isActive('/transactions')} title="Transacciones" icon={IconArrowsExchange} />
        </TabsComponent>
    )
}