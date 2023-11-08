'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Showable from "@/components/showable";
import { Button, Spinner, Table } from "flowbite-react";
import { AuthContext } from "@/app/AuthContext";

export default function Dashboard() {

  const router = useRouter();

  const [gamesData, setGamesData]: [any[] | undefined, Dispatch<SetStateAction<any[] | undefined>>] = useState();
  const [games, setGames]: [any[] | undefined, Dispatch<SetStateAction<any[] | undefined>>] = useState();

  const { validate, session, user } = useContext(AuthContext);

  const getGlobalGames = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/game/global", {
        method: 'GET',
        credentials: 'include'
    });
    let json = await res.json();
    if (!res.ok) return console.log(json);
    setGamesData(json);
  }

  const joinGlobalGame = async (gameid: number) => {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/game/global/" + gameid, {
        method: 'POST',
        credentials: 'include'
    });
    if (!res.ok) return console.log(await res.json());
    router.push('/dashboard/' + gameid);
  }

  const formatGames = (games?: any[]) => {
    if (!games) return;
    let output: any[] = [];
    games.forEach(game => {
        let isJoined: boolean = (user && user.games.findIndex((g: any) => game.gameid == g.game.gameid) >= 0);
        output.push(
        <Table.Row key={game.gameid} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{game.title}</Table.Cell>
            <Table.Cell>{game.initialCash}{game.currencysymbol}</Table.Cell>
            <Table.Cell>{game.maincurrency.asset.name}</Table.Cell>
            <Table.Cell>{stringifyDate(game.startDate)}</Table.Cell>
            <Table.Cell>{stringifyDate(game.finishDate)}</Table.Cell>
            <Table.Cell>
                <Button disabled={isJoined} gradientDuoTone="greenToBlue" className="mt-2" onClick={() => {joinGlobalGame(game.gameid)}}>
                    {isJoined ? 'Ya unido' : 'Unirse'}
                </Button>
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
  }, [session])

  useEffect(() => {
    if (session == "logged") setGames(formatGames(gamesData));
  }, [session, gamesData])

  useEffect(() => {
    getGlobalGames();
  }, [])

  return (
    <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl text-center">Juegos públicos</h1>
        <Showable show={!!games}>
            <Showable show={!!games && games.length <= 0}>
                <h1 className="text-2xl text-center mt-16">No existen juegos públicos</h1>
                <div className="flex justify-center mt-2">
                    <Button gradientDuoTone="greenToBlue" className="mt-2" onClick={() => {router.push('/dashboard')}}>Volver</Button>
                </div>
            </Showable>
            <Showable show={!!games && games.length > 0}>
                <div className="mt-10">
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Nombre</Table.HeadCell>
                            <Table.HeadCell>Dinero inicial</Table.HeadCell>
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
                        <Button gradientDuoTone="greenToBlue" className="mt-2" onClick={() => {router.push('/dashboard')}}>Volver</Button>
                    </div>
                </div>
            </Showable>
        </Showable>
        <Showable show={!games}>
            <div className="text-center mt-16">
                <Spinner size="xl"></Spinner>
            </div>
        </Showable>
    </div>
  )
}
