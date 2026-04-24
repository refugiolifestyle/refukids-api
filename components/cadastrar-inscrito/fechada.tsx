import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { EventoType } from "@/types/evento"
import { Share } from "lucide-react"
import { useCallback } from "react"
import { Button } from "../ui/button"
import { StepProps } from "."

export default function Fechada({ evento, share }: Partial<StepProps>) {
    return <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl">{evento?.titulo}</CardTitle>
            <CardDescription className="text-justify">
                Inscrições em breve
            </CardDescription>
        </CardHeader>
        <CardContent className="text-justify">
            Compartilhe com sua célula e seus amigos para que todos fiquem atentos às próximas novidades do melhor evento do ano! Não perca a oportunidade de garantir seu lugar quando as inscrições abrirem!
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <Button
                onClick={share}
                className="w-full bg-[#fdaf00] hover:bg-[#feef00] text-black">
                <Share className="me-2" />
                Compartilhar
            </Button>
        </CardFooter>
    </Card>
}