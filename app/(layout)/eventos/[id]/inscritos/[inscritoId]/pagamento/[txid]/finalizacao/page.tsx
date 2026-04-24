import BackgroundMainSection from "@/components/background-main-section";
import AguardandoPagamento from "@/components/cadastrar-inscrito/steps/aguardando-pagamento";
import Finalizacao from "@/components/cadastrar-inscrito/steps/finalizacao";
import FinalizacaoComKit from "@/components/cadastrar-inscrito/steps/finalizacao-com-kit";
import { database } from "@/configs/firebase";
import { EventoType } from "@/types/evento";
import { InscritoType } from "@/types/inscrito";
import { get, ref } from "firebase/database";
import { Metadata } from "next";
import Image from "next/image";

type EventoProps = {
    params: {
        id: string
        inscritoId: string
        txid: string
    }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: EventoProps) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/eventos/${params.id}`)
    const { evento } = await response.json() as { evento: EventoType }

    return {
        title: `${evento.titulo} :: Refúgio Lifestyle`,
        description: "Somos uma rede de células pertencente a Igreja do Evangelho Quadrangular - Sede do Pará, que funciona de modo orgânico e relacional, objetivando despertar cada crente a fim de que possa desenvolver suas habilidades ministeriais e funcionar dentro do Reino.",
        openGraph: {
            images: evento.flyer
        }
    } as Metadata
}

export default async function Evento({ params }: EventoProps) {
    if (!params.txid) {
        throw new Error("Identificação do pagamento obrigatório")
    }

    const responseInscritoPagamento = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/eventos/${params.id}/inscricoes/${params.inscritoId}/pagamento/${params.txid}/status`)
    const { status, temKitValido } = await responseInscritoPagamento.json() as { status: string, temKitValido: boolean }

    const responseEvento = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/eventos/${params.id}`)
    const { evento } = await responseEvento.json() as { evento: EventoType }

    const responseInscritoRef = ref(database, `eventos/${params.id}/inscricoes/${params.inscritoId}`)
    const inscrito = await get(responseInscritoRef)

    return <div className="flex flex-col md:flex-row justify-around items-center space-y-20 md:space-y-0 space-x-0 md:space-x-20 w-full">
        <BackgroundMainSection url={evento.fundo} />
        <img
            width={400}
            height={400}
            src={evento.logo}
            className="object-contain"
            alt={`Logo da ${evento.titulo}`} />
        <div id="card-inscricao-geral" className="w-full max-w-[450px]">
            {
                !['paid', 'CONCLUIDA'].includes(status)
                ? <AguardandoPagamento evento={evento} inscrito={inscrito.val() as InscritoType} />
                : temKitValido
                    ? <FinalizacaoComKit evento={evento} inscrito={inscrito.val() as InscritoType} />
                    : <Finalizacao evento={evento} inscrito={inscrito.val() as InscritoType} />
            }
        </div>
    </div>;
}