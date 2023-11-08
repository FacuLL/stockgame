'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { useRouter } from "next/navigation";
import Showable from "@/components/showable";
import { Button, Spinner, Table } from "flowbite-react";

export default function Dashboard() {

  const router = useRouter();

  const { user, validate, session } = useContext(AuthContext);

  const [games, setGames]: [any[] | undefined, Dispatch<SetStateAction<any[] | undefined>>] = useState();

  const formatGames = (games?: any[]) => {
    if (!games) return;
    let output: any[] = [];
    games.forEach(game => {
        let g = game.game;
        output.push(
        <Table.Row key={g.gameid} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{g.title}</Table.Cell>
            <Table.Cell>{game.cash}{g.currencysymbol}</Table.Cell>
            <Table.Cell>{g.maincurrency.asset.name}</Table.Cell>
            <Table.Cell>{stringifyDate(g.startDate)}</Table.Cell>
            <Table.Cell>{stringifyDate(g.finishDate)}</Table.Cell>
            <Table.Cell>
                <Button gradientDuoTone="greenToBlue" className="mt-2" onClick={() => {router.push('/dashboard/' + g.gameid)}}>Jugar</Button>
            </Table.Cell>
        </Table.Row>);
    });
    return output;
  }

  const stringifyDate = (date: string | Date) => {
    let d = new Date(date);
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
  }

  useEffect(() => {
    if (!validate(true)) router.push('/login');
    if (user) setGames(formatGames(user.games));
  }, [session])

  return (
    <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl text-center">Juegos</h1>
        <Showable show={!!user}>
            <Showable show={!!user && user.games && user.games.length <= 0}>
                <h1 className="text-2xl text-center mt-16">No participas en ningún juego</h1>
                <div className="flex justify-center">
                    <Button gradientDuoTone="greenToBlue" className="mt-2" onClick={() => {router.push('/dashboard/global')}}>Explorar juegos públicos</Button>
                </div>
            </Showable>
            <Showable show={!!user && user.games && user.games.length > 0}>
              <div className="mt-10">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Nombre</Table.HeadCell>
                        <Table.HeadCell>Dinero</Table.HeadCell>
                        <Table.HeadCell>Moneda</Table.HeadCell>
                        <Table.HeadCell>Fecha de inicio</Table.HeadCell>
                        <Table.HeadCell>Fecha de cierre</Table.HeadCell>
                        <Table.HeadCell></Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {games}
                    </Table.Body>
                </Table>
                <div className="flex justify-center mt-3">
                    <Button gradientDuoTone="greenToBlue" className="mt-2" onClick={() => {router.push('/dashboard/global')}}>Explorar juegos públicos</Button>
                </div>
              </div>
            </Showable>
        </Showable>
        <Showable show={!user}>
            <div className="text-center mt-16">
                <Spinner size="xl"></Spinner>
            </div>
        </Showable>
    </div>
  )
}
