import { Card, Label, RangeSlider, Table, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";


export default function AssetsTable(props: {assets: any, gameid: any}) {
    const router = useRouter();

    const [assets, setAssets]: [any[] | undefined, Dispatch<SetStateAction<any[] | undefined>>] = useState();

    const formatAssets = (assets: any[]): any[] => {
        let output: any[] = [];
        assets.forEach(relation => {
            let asset = relation.asset;
            output.push(
                <Table.Row key={asset.assetid} className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer" onClick={() => {router.push('/dashboard/' + props.gameid + '/asset/' + asset.assetid)}}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{asset.code}</Table.Cell>
                    <Table.Cell>{asset.name}</Table.Cell>
                    <Table.Cell>{asset.quotation}$</Table.Cell>
                    <Table.Cell><span className={`text-md text-gray-800 ${asset.variation > 0 ? '!text-green-400' : '!text-red-600'}`}>{asset.variation > 0 ? '+' : ''}{asset.variation}%</span></Table.Cell>
                    <Table.Cell>{asset.volume}</Table.Cell>
                </Table.Row>
            )
        });
        return output;
    }

    useEffect(() => {
        setAssets(formatAssets(props.assets));
    }, [])

    return (
      <section className="mt-5 mb-10">
        <h1 className="text-2xl">Todos los activos</h1>
        <div className="grid gap-4 grid-cols-4 mt-4 w-full">
          <div className="col-span-3">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Símbolo</Table.HeadCell>
                <Table.HeadCell>Activo</Table.HeadCell>
                <Table.HeadCell>Última Cotización</Table.HeadCell>
                <Table.HeadCell>Variación</Table.HeadCell>
                <Table.HeadCell>Volumen</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {assets}
              </Table.Body>
            </Table>
          </div>
          <div className="col-span-1">
            <Card>
              <h1 className="text-md">Filtrar por:</h1>
              <form>
                <div className="mb-2 block">
                  <Label htmlFor="code" value="Símbolo" />
                </div>
                <TextInput id="code" type="text" sizing="sm" />
                <div className="mb-2 block mt-2">
                  <Label htmlFor="name" value="Nombre" />
                </div>
                <TextInput id="name" type="text" sizing="sm" />
                <div className="mb-1 block mt-2">
                  <Label htmlFor="price" value="Precio" />
                </div>
                <RangeSlider id="price" sizing="sm" />
                <div className="mb-1 block mt-2">
                  <Label htmlFor="volume" value="Volumen" />
                </div>
                <RangeSlider id="volume" sizing="sm" />
              </form>
            </Card>
          </div>
        </div>
      </section>
    )
}