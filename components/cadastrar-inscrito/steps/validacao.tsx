import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { cpf as cpfValidation } from 'cpf-cnpj-validator'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { StepProps, Steps } from ".."

const FormSchema = z
    .object({
        cpf: z
            .string({
                error: "CPF obrigatório"
            })
            .transform(data => data.replaceAll(/[^\d]+/g, ''))
            .refine(data => cpfValidation.isValid(data), "CPF inválido"),
    })

export default function Validacao({ setStep, evento, setInscrito }: StepProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { cpf: "" }
    })

    async function onSubmit({ cpf }: z.infer<typeof FormSchema>) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/eventos/${evento.id}/inscricoes/${cpf}`)
            const { inscrito, temKitValido } = await response.json() as { inscrito: any, temKitValido: boolean }

            setInscrito(inscrito)

            if (inscrito?.novo) {
                if (!evento.inscricoesAbertas) {
                    setInscrito(undefined)
                    setStep(Steps.INSCRICOES_ENCERRADAS)
                } else {
                    setStep(Steps.FORMULARIO)
                }
            } else {
                let pagamentos = Object.values(inscrito.pagamentos || {})
                if (pagamentos.length && pagamentos.some((pagamento: any) => ["CONCLUIDA", "paid"].includes(pagamento.status!))) {
                    setStep(temKitValido ? Steps.FINALIZACAO_COM_KIT : Steps.FINALIZACAO)
                } else {
                    if (!evento.inscricoesAbertas) {
                        setInscrito(undefined)
                        setStep(Steps.INSCRICOES_ENCERRADAS)
                    } else {
                        setStep(Steps.TERMOS)
                    }
                }
            }

            return true
        }
        catch (e) {
            alert("Falha ao validar o inscrito")
        }
    }

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">{evento?.titulo}</CardTitle>
                    <CardDescription>
                        Formulário de validação
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder={`Digite seu CPF para verificar seu cadastro.`} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full bg-[#fdaf00] hover:bg-[#feef00] text-black">
                        Avançar
                    </Button>
                </CardFooter>
            </Card>
        </form>
    </Form>
}