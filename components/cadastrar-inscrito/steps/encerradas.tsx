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
import { BookmarkX, CheckCircle, CircleX, TicketX } from "lucide-react"
import { StepProps } from ".."

export default function Encerradas({ evento, inscrito, reset }: Partial<StepProps>) {
    let inscritoNomeParts = inscrito?.nome?.trim().split(" ")

    return <Card className="w-full max-w-sm">
        <CardHeader>
            <div className="flex flex-row space-x-4">
                <CircleX size={42} className="text-red-600" />
                <div className="flex-1">
                    <CardTitle>{evento?.titulo}</CardTitle>
                    <CardDescription>Inscrições encerradas</CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-justify">
            {
                inscritoNomeParts?.length && (<p >Olá <b>{inscritoNomeParts.shift()}{inscritoNomeParts.length && ` ${inscritoNomeParts.pop()}`}</b>,</p>)
            }
            {
                inscrito?.novo
                    ? <>
                        <p>
                            As inscrições para esse evento foram encerradas e, infelizmente,
                            você acabou ficando de fora desta edição.
                        </p>
                        <p>
                            Esperamos muito te ver no próximo evento — vai ser uma grande bênção!
                        </p>
                    </>
                    : inscrito?.nome
                        ? <>
                            <p>
                                As inscrições para esse evento foram encerradas e
                                <b> não identificamos nenhum pagamento válido</b> durante o período em que estavam abertas.
                            </p>
                            <p>
                                Caso ache que isso é um engano ou queira mais esclarecimentos, procure sua
                                liderança da célula — eles poderão te orientar.
                            </p>
                        </>
                        : <p>
                            As inscrições para esse evento foram oficialmente encerradas.
                        </p>
            }
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