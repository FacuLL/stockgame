import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function TransactionModal(props: {show: boolean, asset: any, action: "buy" | "sell", gameid: any, onClose: any}) {
    const router = useRouter();

    const [amount, setAmount] = useState("0");
    const [error, setError] = useState("");

    const makeTransaction = async () => {
        if (Number.isNaN(parseInt(amount)) || parseInt(amount) <= 0) return setError("Ingresa un número");
        const data = {
            "amount": parseInt(amount),
            "gameid": parseInt(props.gameid),
            "assetid": parseInt(props.asset.assetid),
            "action": props.action
        };
        console.log(data);
        
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/transaction", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const json = await res.json();
        if (!res.ok) return setError(handleErrorMessage(json));
        return router.push('/dashboard/' + props.gameid);
    }

    const handleErrorMessage = (err: any) => {
        if (err.message == "Not enough cash") return "No tenes suficiente dinero";
        if (err.message == "Not enough stock") return "No tenes suficiente cantidad";
        return "Error inesperado";
    }

    return (
        <Modal show={props.show} size="md" popup onClose={props.onClose}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{props.action == "buy" ? "Comprar " : "Vender "}{props.asset.name}</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="amount" value="Cantidad" />
              </div>
              <TextInput
                id="amount"
                value={amount}
                onChange={(event) => {setAmount(event.target.value)}}
                required
              />
            </div>
            <div className="w-full">
              <Button onClick={() => {makeTransaction()}}>{props.action == "buy" ? "Comprar" : "Vender"}</Button>
            </div>
            <p className="text-red-500 mt-2">{error}</p>
          </div>
        </Modal.Body>
      </Modal>
    )
}