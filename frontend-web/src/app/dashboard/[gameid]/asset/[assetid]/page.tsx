'use client';

import { AuthContext } from "@/app/AuthContext";
import stringifyDateWithHour from "@/app/utils/stringifydate";
import AssetChart from "@/components/asset-chart";
import Showable from "@/components/showable";
import TransactionModal from "@/components/transaction-modal";
import { Button, Card, Spinner, Table } from "flowbite-react";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

export default function Asset() {
  const router = useRouter();
  const params = useParams();
  const { session, validate, user } = useContext(AuthContext);
  const [asset, setAsset]: [any | undefined, Dispatch<SetStateAction<any | undefined>>] = useState();
  const [transactions, setTransactions]: [any[] | undefined, Dispatch<SetStateAction<any[] | undefined>>] = useState();
  const [error, setError] = useState();

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  useEffect(() => {
    validateSession();
    if (session == 'logged') getAsset();
  }, [session]);

  const handleErrors = (error: any) => {
    switch(error.statusCode) {
      case 404: return router.push('/dashboard/' + params.gameid);
    }
  }

  const validateSession = async () => {
    if (!await validate(true)) router.push('/login');
  }

  const getAsset = async () => {
    if (!params) return;
    let res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/asset/' + params.assetid + '?gameid=' + params.gameid, {
        method: 'GET',
        credentials: 'include'
    });
    let json = await res.json();
    if (!res.ok) return handleErrors(json);
    
    setAsset(json);
    setTransactions(formatTransactions(json));
  }

  const formatTransactions = (asset: any): any[] => {
    if (!asset.extra?.instance) return [];
    let transactions: any[] = asset.extra.instance.transactions.filter((t: any) => t.asset.assetid == asset.assetid);
    let output: any[] = [];
    transactions.forEach(transaction => {
      output.push(
        <Table.Row key={transaction.transactionid} className="bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell>{stringifyDateWithHour(transaction.date)}</Table.Cell>
          <Table.Cell className={transaction.action == "buy" ? "text-blue-500" : "text-orange-400"}>{transaction.action == "buy" ? "Compra" : "Venta"}</Table.Cell>
          <Table.Cell>{transaction.amount}</Table.Cell>
          <Table.Cell>{transaction.quotation}$</Table.Cell>
          <Table.Cell>{transaction.quotation * transaction.amount}$</Table.Cell>
        </Table.Row>
      )
    });
    return output;
  }



  return (
    <div className="max-w-5xl mx-auto w-full">
        <Showable show={!!user && asset && !error}>
          <Button className="absolute" size="sm" onClick={() => {router.push('/dashboard/' + params.gameid)}}>Volver</Button>
          <div className="flex items-center gap-4 justify-center w-full">
            <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col p-2"><p className="text-xl">{asset?.code}</p></div>
            <h1 className="text-3xl text-center">{asset?.name}</h1>
          </div>
          <section className="w-full">
            <AssetChart />
          </section>
          <section className="w-full mt-4">
          <div className="flex justify-center gap-2 flex-wrap">
            <Card>
                <h1 className="text-center text-2xl">{asset?.quotation}$</h1>
                <h2 className="text-center">Cotización</h2>
            </Card>
            <Card>
                <h1 className="text-center text-2xl">{asset?.extra?.stock ? asset?.extra?.stock : 0}</h1>
                <h2 className="text-center">En el inventario</h2>
            </Card>
            <Card>
                <h1 className="text-md"><span className="text-gray-500">Apertura:</span> {asset?.open}$</h1>
                <h1 className="text-md"><span className="text-gray-500">Máximo:</span> {asset?.high}$</h1>
                <h1 className="text-md"><span className="text-gray-500">Mínimo:</span> {asset?.low}$</h1>
            </Card>
          </div>
          </section>
          <section className="w-full mt-4">
            <h2 className="text-2xl">Tus últimas transacciones</h2>
            <div className="grid grid-cols-4 w-full gap-4 mt-4">
              <div className="col-span-3">
                  <Table>
                      <Table.Head>
                          <Table.HeadCell>Fecha</Table.HeadCell>
                          <Table.HeadCell>Acción</Table.HeadCell>
                          <Table.HeadCell>Cantidad</Table.HeadCell>
                          <Table.HeadCell>Cotización</Table.HeadCell>
                          <Table.HeadCell>Total</Table.HeadCell>
                      </Table.Head>
                      <Table.Body className="divide-y">
                          {transactions}
                      </Table.Body>
                  </Table>
              </div>
              <div className="col-span-1">
                  <Card>
                    <h1 className="text-2xl">Transaccionar</h1>
                    <div className="flex flex-col gap-4">
                      <Button gradientDuoTone="greenToBlue" onClick={() => {setShowBuyModal(true)}}>Comprar</Button>
                      <TransactionModal gameid={params.gameid} asset={asset} action="buy" show={showBuyModal} onClose={() => {setShowBuyModal(false)}}></TransactionModal>
                      <Button gradientDuoTone="pinkToOrange" onClick={() => {setShowSellModal(true)}}>Vender</Button>
                      <TransactionModal gameid={params.gameid} asset={asset} action="sell" show={showSellModal} onClose={() => {setShowSellModal(false)}}></TransactionModal>
                    </div>
                  </Card>
              </div>
            </div>
          </section>
        </Showable>
        <Showable show={!!error}>
          <div className="flex items-center">
            <h1 className="text-4xl text-center">{error}</h1>
          </div>
        </Showable>
        <Showable show={!error && !asset}>
          <div className="text-center mt-16">
            <Spinner size="xl"></Spinner>
          </div>
        </Showable>
      </div>
  )
}