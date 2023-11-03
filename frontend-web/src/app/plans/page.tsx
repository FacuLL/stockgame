import PlanCard from "@/components/plan-card";
import PlanCardFeature from "@/components/plan-card-feature";

export default function Plans() {

    return(
    <section>
        <h1 className="text-2xl font-bold text-[#002D74] text-center">Planes</h1>
        <h3 className="text-md text-gray-400 text-center">Elegí un precio adaptado a tus necesidades</h3>
        <div className="flex flex-wrap gap-3 justify-center mt-3 h-min">
            <PlanCard title="Acceso total" symbol="usd" price={6}>
                <PlanCardFeature enabled>Acceso al simulador</PlanCardFeature>
                <PlanCardFeature enabled>Cotizaciones en tiempo real</PlanCardFeature>
                <PlanCardFeature enabled>Acciones, commodities y monedas</PlanCardFeature>
                <PlanCardFeature enabled>Tutoriales de inversiones</PlanCardFeature>
                <PlanCardFeature enabled>Atención al cliente 24/7</PlanCardFeature>
            </PlanCard>
        </div>
    </section>
        )
}