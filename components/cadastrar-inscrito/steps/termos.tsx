import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { EventoTermoType } from "@/types/evento"
import { InscritoType } from "@/types/inscrito"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { StepProps, Steps } from ".."

const formSchema: z.ZodType<{ termos: EventoTermoType[] }> = z
    .object({
        termos: z
            .object({
                termo: z.number(),
                descricao: z.string(),
                assinado: z.boolean().refine((assinado) => !!assinado),
            })
            .array()
    })

export default function Termos({ setStep, inscrito, setInscrito, reset, evento }: StepProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            termos: inscrito?.termos || evento.termos.map(termo => ({ ...termo, assinado: false }))
        }
    });


    async function onSubmit({ termos }: { termos: EventoTermoType[] }) {
        const payload: InscritoType = { ...inscrito!, termos }

        if (evento.pagamentos.length > 1) {
            setInscrito(payload)
            setStep(Steps.PARCELAS)
        } else {
            payload.pagamentosAFazer = evento.pagamentos

            setInscrito(payload)
            setStep(Steps.PAGAMENTO)
        }
    }

    const termos = form.watch('termos');

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Termos</CardTitle>
                    <CardDescription>
                        Leia e marque os termos abaixo para continuar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 h-full overflow-none md:h-[250px] md:overflow-y-scroll mb-4">
                    {termos.map((termo, index) => <FormField
                        key={`termo_${termo.termo}`}
                        control={form.control}
                        name={`termos.${index}.assinado`}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-y-0 space-x-2">
                                <FormControl>
                                    <Checkbox
                                        checked={termo.assinado}
                                        onCheckedChange={field.onChange}
                                    />

                                </FormControl>
                                <FormLabel className="leading-5 text-justify" dangerouslySetInnerHTML={{ __html: termo.descricao }}></FormLabel>
                            </FormItem>
                        )}
                    />)}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button
                        disabled={!form.formState.isValid}
                        type="submit"
                        className="w-full bg-[#fdaf00] hover:bg-[#feef00] text-black">
                        Avançar
                    </Button>
                    <a href="#" className="text-sm" onClick={() => inscrito?.novo ? setStep(s => --s) : reset()}>
                        Voltar
                    </a>
                </CardFooter>
            </Card>
        </form>
    </Form>
}