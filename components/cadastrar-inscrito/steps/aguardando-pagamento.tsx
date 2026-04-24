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
import { Clock } from "lucide-react"
import { StepProps } from ".."

export default function AguardandoPagamento({ inscrito, evento, reset }: Partial<StepProps>) {
    let inscritoNomeParts = inscrito?.nome?.trim().split(" ")

    return <Card className="w-full max-w-sm">
        <CardHeader>
            <div className="flex flex-row space-x-4">
                <Clock size={42} className="text-yellow-600" />
                <div className="flex-1">
                    <CardTitle>{evento?.titulo}</CardTitle>
                    <CardDescription>Aguardando o pagamento</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-justify">
            {
                inscritoNomeParts?.length && (<p >Olá <b>{inscritoNomeParts.shift()}{inscritoNomeParts.length && ` ${inscritoNomeParts.pop()}`}</b>,</p>)
            }
            <p>
                Estamos aguardando a confirmação do pagamento da sua inscrição para esse evento. Assim que o pagamento for processado, sua situação será atualizada para os próximos passos.
            </p>
            <p>
                Caso já tenha realizado o pagamento, aguarde alguns instantes ou entre em contato com sua liderança.
            </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button
                onClick={reset}
                className="w-full bg-[#fdaf00] hover:bg-[#feef00] text-black gap-2">
                Início
            </Button>
        </CardFooter>
    </Card>
}