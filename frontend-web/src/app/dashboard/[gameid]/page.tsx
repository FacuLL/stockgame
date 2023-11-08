'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { useParams, useRouter } from 'next/navigation';
import { Card, Carousel, Spinner, Table } from "flowbite-react";
import Showable from "@/components/showable";
import PopularAssetsCarousell from "@/components/popular-assets-carousell";
import MainInfo from "@/components/main-info";
import AssetsTable from "@/components/assets-table";
import DashboardTabs from "@/components/dashboard-tabs";

export default function DashboardGame() {
  const router = useRouter();
  const params = useParams();
  const { session, validate, user } = useContext(AuthContext);
  const [game, setGame]: [any | undefined, Dispatch<SetStateAction<any | undefined>>] = useState();
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
    console.log(json);
    
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
          <h1 className="text-3xl text-center">{game?.game?.title}</h1>
          <DashboardTabs gameid={params.gameid}/>
          <MainInfo game={game} />
          <PopularAssetsCarousell gameid={params.gameid} />
          <AssetsTable assets={game?.game?.assets} gameid={params.gameid} />
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
