import { Card } from "flowbite-react";


export default function MainInfo(props: {game: any}) {
 const game = props.game
 let variation = 0;
 if (game) variation = Number((100 * ((game.cash - game.game.initialCash) / game.game.initialCash)).toFixed(2));
 return (
    <div className="flex justify-center gap-2 flex-wrap">
        <Card>
            <h1 className={`text-center text-2xl ${variation > 0 ? '!text-green-400' : '!text-red-600'}`}>{variation}%</h1>
            <h2 className="text-center">Ganancia</h2>
        </Card>
        <Card>
            <h1 className="text-center text-2xl">{game && game.cash}$</h1>
            <h2 className="text-center">Saldo actual</h2>
        </Card>
        <Card>
            <h1 className="text-center text-2xl">{game && game.transactions ? game.transactions.length : 0}</h1>
            <h2 className="text-center">Transacciones</h2>
        </Card>
        <Card>
            <h1 className="text-center text-2xl">{game && game.assets ? game.assets.length : 0}</h1>
            <h2 className="text-center">Activos</h2>
        </Card>
    </div>
 )
}