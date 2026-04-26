'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { StepProps } from ".."

export default function FinalizacaoComKit({ inscrito, evento, reset }: Partial<StepProps>) {
    let inscritoNomeParts = inscrito?.nome?.trim().split(" ")

    return <Card className="w-full max-w-sm">
        <CardHeader>
            <div className="flex flex-row space-x-4">
                <CheckCircle size={42} className="text-green-600" />
                <div className="flex-1">
                    <CardTitle>{evento?.titulo}</CardTitle>
                    <CardDescription>Pagamento realizado com sucesso</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-justify">
            <div className="p-4 bg-yellow-100 border-2 border-yellow-400 rounded-xl shadow-md">

                <h1 className="text-2xl font-bold text-yellow-700 flex items-center justify-center gap-2">
                    🎁 Parabéns!
                </h1>
                <p className="mt-2 text-lg text-center text-gray-800 font-medium">
                    Você ganhou um <span className="font-semibold">Kit Exclusivo</span> 🏆
                </p>
            </div>
            {
                inscritoNomeParts?.length && (<p >Olá <b>{inscritoNomeParts.shift()}{inscritoNomeParts.length && ` ${inscritoNomeParts.pop()}`}</b>,</p>)
            }
            <p>Seu pagamento foi processado com sucesso, a cada dia que passa estamos mais ansiosos para viver tudo o que Deus tem preparado para esse evento.</p>
            <p>Você poderá retirar o seu Kit Exclusivo no momento do credenciamento, no dia do evento.</p>
            <p>Aguarde o direcionamento da sua liderança para os próximos passos.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button
                onClick={reset}
                className="w-full bg-[#fdaf00] hover:bg-[#feef00] text-black">
                Início
            </Button>
        </CardFooter>
    </Card>
}