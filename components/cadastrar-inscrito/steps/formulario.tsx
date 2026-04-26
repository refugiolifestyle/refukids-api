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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputMask } from '@react-input/mask'
import { cpf as cpfValidation } from 'cpf-cnpj-validator'
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { StepProps, Steps } from ".."

const FormSchema = z
    .object({
        cpfEsposa: z
            .string({
                error: "O campo é obrigatório",
            })
            .length(14, "O campo precisa conter 11 digitos")
            .refine(data => cpfValidation.isValid(data), "Campo inválido (digite somente números)"),
        rgEsposa: z
            .string({
                error: "O campo é obrigatório",
            })
            .length(9, "O campo precisa conter 7 digitos"),
        nomeEsposa: z
            .string({ error: "O campo é obrigatório" })
            .min(10, { message: "Campo precisa ter no mínimo 10 caracteres" }),
        redeEsposa: z
            .string({
                error: "O campo é obrigatório"
            }),
        celulaEsposa: z
            .string({
                error: "O campo é obrigatório"
            }),
        cpf: z
            .string({
                error: "O campo é obrigatório",
            })
            .length(14, "O campo precisa conter 11 digitos")
            .refine(data => cpfValidation.isValid(data), "Campo inválido (digite somente números)"),
        rg: z
            .string({
                error: "O campo é obrigatório",
            })
            .length(9, "O campo precisa conter 7 digitos"),
        nome: z
            .string({ error: "O campo é obrigatório" })
            .min(10, { message: "Campo precisa ter no mínimo 10 caracteres" }),
        rede: z
            .string({
                error: "O campo é obrigatório"
            }),
        celula: z
            .string({
                error: "O campo é obrigatório"
            }),
        endereco: z
            .string({ error: "O campo é obrigatório" })
            .min(10, { message: "Campo precisa ter no mínimo 10 caracteres" }),
        dataDeCasamento: z
            .string({ error: "O campo é obrigatório" })
            .min(1, { message: "O campo é obrigatório" }),
        telefone: z
            .string({ error: "O Campo Telefone é obrigatório" })
            .min(10, { message: "Campo precisa ter no mínimo 10 digitos" })
            .max(11, { message: "Campo precisa ter no máximo 11 digitos" }),
        email: z
            .string({
                error: "O Campo Email é obrigatório",
            })
            .email("O Campo Email é obrigatório")
    }).superRefine(({ redeEsposa, rede, celulaEsposa, celula }, ctx) => {
        if (!rede) {
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "O campo é obrigatório",
                path: ["rede"]
            })
        } else if (!redeEsposa) {
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "O campo é obrigatório",
                path: ["redeEsposa"]
            })
        } else if (!celula) {
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "O campo é obrigatório",
                path: ["celula"]
            })
        } else if (!celulaEsposa) {
            return ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "O campo é obrigatório",
                path: ["celulaEsposa"]
            })
        }
    })

export default function Formulario({ setStep, inscrito, setInscrito, reset, evento, celulas }: StepProps) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            cpfEsposa: "",
            rgEsposa: "",
            nomeEsposa: "",
            redeEsposa: "",
            celulaEsposa: "",
            cpf: "",
            rg: "",
            nome: "",
            rede: "",
            celula: "",
            endereco: "",
            dataDeCasamento: "",
            telefone: "",
            email: ""
        }
    })

    useEffect(() => {
        const subscription = form.watch((_, { name, type }) => {
            if (name === "rede" && type === "change") {
                form.setValue("celula", "", { shouldValidate: true })
            }

            if (name === "redeEsposa" && type === "change") {
                form.setValue("celulaEsposa", "", { shouldValidate: true })
            }
        })

        return () => subscription.unsubscribe()
    }, [form.watch])

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const payload: any = {
                ...data,
                inscritoEm: new Date().toString(),
                nome: data.nome.toLowerCase().replace(/(^.|\s+.)/g, m => m.toUpperCase()),
                nomeEsposa: data.nomeEsposa.toLowerCase().replace(/(^.|\s+.)/g, m => m.toUpperCase()),
                cpf: data.cpf.replaceAll(/[^\d]+/g, ''),
                cpfEsposa: data.cpf.replaceAll(/[^\d]+/g, ''),
                rg: data.rg.replaceAll(/[^\d]+/g, ''),
                rgEsposa: data.rgEsposa.replaceAll(/[^\d]+/g, ''),
                telefone: data.telefone.replaceAll(/[^\d]+/g, ''),
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/eventos/${evento.id}/inscricoes`, {
                method: 'POST',
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const { message } = await response.json()
                throw message
            }

            setInscrito(payload)
            setStep(Steps.TERMOS)
        } catch (e: any) {
            alert(e)
            console.error(e)
        }
    }

    const sorter = new Intl.Collator('pt-BR', { numeric: true, usage: "sort" });

    const redes = celulas?.map(c => c.rede)
        .filter((r, i, a) => a.indexOf(r) === i)
        .sort((a, b) => sorter.compare(a, b))

    const celulasMarido = !celulas ? []
        : form.watch("rede")
            ? celulas?.filter(c => c.rede === form.watch("rede"))
            : celulas

    const celulasEsposa = !celulas ? []
        : form.watch("redeEsposa")
            ? celulas?.filter(c => c.rede === form.watch("redeEsposa"))
            : celulas

    return <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, data => console.log(data))}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Formulário</CardTitle>
                    <CardDescription>Preencha seus dados para continuar</CardDescription>
                </CardHeader>
                <CardContent>
                    <h2 className="font-medium">Informações do Marido</h2>
                    <div className="space-y-2 mb-4 mt-2">

                        <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputMask
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            mask="___.___.___-__"
                                            replacement={{ _: /\d/ }}
                                            placeholder="Digite o CPF do Marido" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rg"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputMask
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            mask="__.___-__"
                                            replacement={{ _: /\d/ }}
                                            placeholder="Digite o RG do Marido" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nome"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Digite o nome completo do Marido" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rede"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={form.watch('rede') ? 'text-black' : 'text-gray-500'} >
                                                <SelectValue placeholder="Selecione a rede do Marido" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {redes?.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="celula"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={form.watch('celula') ? 'text-black' : 'text-gray-500'}>
                                                <SelectValue placeholder="Selecione a célula do Marido" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                celulasMarido
                                                    .sort((a, b) => sorter.compare(a.celula, b.celula))
                                                    .map(c => <SelectItem key={`marido-${c.celula}`} value={c.celula}>{c.celula}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <h2 className="font-medium">Informações da Esposa</h2>
                    <div className="space-y-2 mb-4 mt-2">
                        <FormField
                            control={form.control}
                            name="cpfEsposa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputMask
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            mask="___.___.___-__"
                                            replacement={{ _: /\d/ }}
                                            placeholder="Digite o CPF da Esposa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rgEsposa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputMask
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            mask="__.___-__"
                                            replacement={{ _: /\d/ }}
                                            placeholder="Digite o RG da Esposa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nomeEsposa"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Digite o nome completo da Esposa" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="redeEsposa"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={form.watch('redeEsposa') ? 'text-black' : 'text-gray-500'} >
                                                <SelectValue placeholder="Selecione a rede da Esposa" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {redes?.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="celulaEsposa"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className={form.watch('celulaEsposa') ? 'text-black' : 'text-gray-500'} >
                                                <SelectValue placeholder="Selecione a célula da Esposa" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                celulasEsposa
                                                    .sort((a, b) => sorter.compare(a.celula, b.celula))
                                                    .map(c => <SelectItem key={`esposa-${c.celula}`} value={c.celula}>{c.celula}</SelectItem>)
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <h2 className="font-medium">Informações de contato</h2>
                    <div className="space-y-2 mb-4 mt-2">
                        <FormField
                            control={form.control}
                            name="dataDeCasamento"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <InputMask
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            mask="__/__/____"
                                            replacement={{ _: /\d/ }}
                                            placeholder="Digite a data de casamento, DD/MM/YYYY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endereco"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Digite o endereço completo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="telefone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Digite seu telefone, DDD + Número" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Digite seu email" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                        className="w-full bg-[#fdaf00] hover:bg-[#feef00] text-black">
                        Avançar
                    </Button>
                    <a href="#" className="text-sm" onClick={reset}>
                        Voltar
                    </a>
                </CardFooter>
            </Card>
        </form>
    </Form>
}