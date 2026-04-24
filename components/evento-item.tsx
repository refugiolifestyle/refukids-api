"use client"

import { Loader2, Volume2, VolumeX } from "lucide-react"
import { useEffect, useState } from "react"

type EventoItemProps = {
    evento: any
}

export default function EventoItem({ evento }: EventoItemProps) {
    const [muted, setMuted] = useState(true)
    const [inscricoesAbertas, setInscricoesAbertas] = useState<boolean>()

    useEffect(() => {
        (async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/eventos/${evento.id}/inscricoesAbertas`)
            const data = await response.json() as { inscricoesAbertas: boolean }

            setInscricoesAbertas(data.inscricoesAbertas)
        })();
    }, [])

    return <div className="evento">
        {
            evento.chamada
                ? <>
                    <video
                        playsInline={true}
                        loop={true}
                        muted={muted}
                        autoPlay={true}
                        controls={false}
                        className="absolute bottom-0 left-0 top-0 right-0 object-cover z-[-1] w-full h-screen brightness-25 pointer-events-none">
                        <source src={evento.chamada} type="video/mp4" />
                    </video>
                    <div
                        onClick={() => setMuted(o => !o)}
                        className="absolute bottom-4 right-4 cursor-pointer border rounded-full p-2 flex justify-center items-center">
                        {
                            muted
                                ? <VolumeX color="#fff" />
                                : <Volume2 color="#fff" />
                        }
                    </div>
                </>
                : <img
                    src={evento.fundo}
                    className="absolute bottom-0 left-0 top-0 right-0 object-cover z-[-1] w-full h-screen pointer-events-none" />
        }
        <a href={`/eventos/${evento.id}`} className=" cursor-pointer p-4 border border-white rounded-xl flex flex-col md:flex-row items-start md:items-center gap-6 bg-neutral-700 bg-opacity-50 hover:bg-opacity-75">
            <img width={86} height={86} className="object-contain" src={evento.logo} alt={`Logo ${evento.titulo}`} />
            <div className="flex flex-col">
                <h1 className="text-white text-2xl">{evento.titulo}</h1>
                {
                    inscricoesAbertas === undefined
                        ? <Loader2 className="text-white animate-spin mt-2" />
                        : <h4 className="text-gray-300 font-light">{inscricoesAbertas ? 'Inscrições aqui' : !evento.qtdInscricoesCadastradas ? 'Inscrições em breve' : 'Inscrições encerradas'}</h4>
                }
            </div>
        </a>
    </div>
}