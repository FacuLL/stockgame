'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useParams, useRouter } from 'next/navigation';
import { Button, Spinner, Table } from "flowbite-react";
import Showable from "@/components/showable";
import DashboardTabs from "@/components/dashboard-tabs";
import { AuthContext } from "@/app/AuthContext";

export default function DashboardGame() {
  const router = useRouter();
  const params = useParams();
  const { session, validate, user } = useContext(AuthContext);
  const [game, setGame]: [any | undefined, Dispatch<SetStateAction<any | undefined>>] = useState();
  const [assets, setAssets]: [any | undefined, Dispatch<SetStateAction<any | undefined>>] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    validateSession();
    if (session == 'logged') getGame();
  }, [session])

  const getGame = async () => {
    if (!params) return;
    let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/game/' + params.gameid, {
        method: 'GET',
        credentials: 'include'
    });
    let json = await res.json();
    if (!res.ok) return handleErrors(json);
    setGame(json);
    setAssets(formatAssets(json.assets));
  }

  const formatAssets = (assets: any[]) => {
    let output: any[] = [];
    assets.forEach(asset => {
      output.push(
        <Table.Row key={asset.assetid} className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer" onClick={() => {router.push('/dashboard/' + params.gameid + '/asset/' + asset.asset.assetid)}}>
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{asset.asset.code}</Table.Cell>
          <Table.Cell>{asset.asset.name}</Table.Cell>
          <Table.Cell>{asset.stock}</Table.Cell>
          <Table.Cell>{asset.asset.quotation}$</Table.Cell>
          <Table.Cell>{asset.stock * asset.asset.quotation}$</Table.Cell>
          <Table.Cell>
            <Button gradientDuoTone="pinkToOrange" size="sm" onClick={() => {}}>Vender</Button>
          </Table.Cell>
        </Table.Row>
      )
    });
    return output;
  }

  const handleErrors = (error: any) => {
    switch(error.statusCode) {
      case 404: return router.push('/dashboard');
    }
  }

  const validateSession = async () => {
    if (!await validate(true)) router.push('/login');
  }
    
  return (
      <div className="max-w-5xl mx-auto w-full">
        <Showable show={!!user && game && !error}>
          <h1 className="text-3xl text-center">{game && game.game.title}</h1>
          <DashboardTabs gameid={params.gameid}/>
          <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Símbolo</Table.HeadCell>
                <Table.HeadCell>Activo</Table.HeadCell>
                <Table.HeadCell>Cantidad</Table.HeadCell>
                <Table.HeadCell>Cotización actual</Table.HeadCell>
                <Table.HeadCell>Total</Table.HeadCell>
                <Table.HeadCell></Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {assets}
              </Table.Body>
            </Table>
        </Showable>
        <Showable show={!!error}>
          <div className="flex items-center">
            <h1 className="text-4xl text-center">{error}</h1>
          </div>
        </Showable>
        <Showable show={!error && !game}>
          <div className="text-center mt-16">
            <Spinner size="xl"></Spinner>
          </div>
        </Showable>
      </div>
  )
}
