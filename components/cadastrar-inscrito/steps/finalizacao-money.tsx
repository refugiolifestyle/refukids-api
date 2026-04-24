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
import { CheckCircle, ExternalLink, Plus, Share } from "lucide-react"
import { StepProps } from ".."
import { useRouter } from "next/navigation"

export default function FinalizacaoMoney({ inscrito, evento, reset }: Partial<StepProps>) {
    let inscritoNomeParts = inscrito?.nome?.trim().split(" ")

    return <Card className="w-full max-w-sm">
        <CardHeader>
            <div className="flex flex-row space-x-4">
                <CheckCircle size={42} className="text-green-600" />
                <div className="flex-1">
                    <CardTitle>{evento?.titulo}</CardTitle>
                    <CardDescription>Pré-inscrição realizada com sucesso</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-justify">
            {
                inscritoNomeParts?.length && (<p >Olá <b>{inscritoNomeParts.shift()}{inscritoNomeParts.length && ` ${inscritoNomeParts.pop()}`}</b>,</p>)
            }
            <p>Sua intenção de pagamento em dinheiro foi realizada com sucesso, a cada dia que passa estamos mais ansiosos para viver tudo o que Deus tem preparado para esse evento.</p>
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