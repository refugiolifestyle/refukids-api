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

export default function Finalizacao({ inscrito, evento, reset }: Partial<StepProps>) {
    let nomeMarido = inscrito?.nome?.split(' ').shift()
    let nomeEsposa = inscrito?.nomeEsposa?.split(' ').shift()

    return <Card className="w-full max-w-sm">
        <CardHeader>
            <div className="flex flex-row space-x-4">
                <CheckCircle size={42} className="text-green-600" />
                <div className="flex-1">
                    <CardTitle>{evento?.titulo}</CardTitle>
                    <CardDescription>Inscrição cadastrada com sucesso</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-justify">
            <p >Olá casal <b>{nomeMarido} & {nomeEsposa}</b></p>
            <p>Parabéns, primeira etapa concluída! Você tem até o dia 19/04 para finalizar sua inscrição entregando os documentos necessários para a sua liderança. </p>
            <p>Em caso de não entrega dos documentos, a vaga será reaberta e seu valor será devolvido, com desconto de taxas administrativas.</p>
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