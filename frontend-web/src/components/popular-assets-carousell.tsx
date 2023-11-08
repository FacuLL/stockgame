import { Button, Card, Carousel, Spinner } from "flowbite-react";
import Showable from "./showable";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AssetChart from "./asset-chart";

export default function PopularAssetsCarousell(props: { gameid: any }) {
    const router = useRouter()

    const [assets, setAssets]: [any | undefined, Dispatch<SetStateAction<any | undefined>>] = useState();
    const [error, setError] = useState();

    const getAssets = async () => {
      let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/game/' + props.gameid + '/popularAssets', {
        method: 'GET',
        credentials: 'include'
      });
      let json = await res.json();
      if (res.ok) return setAssets(formatAssets(json));
      console.log(json);
      setError(json.message);
    }

    const formatAssets = (assets: any[]) => {
      let output: any[] = [];
      assets.forEach(asset => {
        output.push(
          <div key={asset.assetid} className="grid grid-cols-3 gap-2 h-full bg-gray-100 dark:bg-gray-700 dark:text-white">
            <div className="px-3 py-5 col-span-1">
              <h2 className="text-2xl text-center">{asset.name}</h2>
              <Card className="mt-4">
                <div className="flex flex-wrap gap-3 items-center">
                  <h3 className="text-xl text-center">{asset.quotation}$</h3>
                  <p className={`text-md text-gray-800 ${asset.variation > 0 ? '!text-green-400' : '!text-red-600'}`}>{asset.variation > 0 ? '+' : ''}{asset.variation}%</p>
                </div>
                <p className="text-md">Open: {asset.open}</p>
                <p className="text-md">Low: {asset.low}</p>
                <p className="text-md">High: {asset.high}</p>
              </Card>
              <div className="flex justify-center mt-4">
                <Button gradientDuoTone={asset.variation > 0 ? 'greenToBlue' : 'pinkToOrange'} onClick={() => {router.push('/dashboard/game/' + props.gameid + '/asset/' + asset.assetid)}}>Más detalles</Button>
              </div>
            </div>
            <div className="px-3 py-5 col-span-2">
              <AssetChart />
            </div>
          </div>
        );
      });
      return output;
    }

    useEffect(() => {
      getAssets();
    }, [])

    return(
        <Showable show={!error}>
          <section className="mt-5">
            <Showable show={!!assets && assets.length > 0}>
              <h1 className="text-2xl">Más populares</h1>
              <div className="h-96 w-full mt-3">
                <Carousel slideInterval={5000} rightControl={<></>} leftControl={<></>}>
                  {assets}
                </Carousel>
              </div>
            </Showable>
            <Showable show={!assets}>
              <div className="text-center mt-16">
                <Spinner size="xl"></Spinner>
              </div>
            </Showable>
          </section>
        </Showable>
    )
}