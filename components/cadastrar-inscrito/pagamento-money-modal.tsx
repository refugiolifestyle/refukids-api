import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { EventoType } from "@/types/evento"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z, ZodType } from "zod"



export function PagamentoMoneyModal({ onSubmit, loading, evento }: { evento: EventoType, loading: boolean, onSubmit: () => Promise<boolean | undefined> }) {

    const formSchema = z
        .object(Object.fromEntries(evento.temPromocaoTermos
            ?.map(t => ([`termo_${t.termo}`, z.boolean().refine((termo) => !!termo)])) as any) as Record<string, ZodType>)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: Object.fromEntries(evento.temPromocaoTermos
            ?.map(t => ([`termo_${t.termo}`, false])) as any) as Record<string, ZodType>
    });

    return (
        <Dialog modal={true}>
            <DialogTrigger asChild>
                <Button className="w-full bg-[#fdaf00] hover:bg-[#feef00] text-black">
                    Pagar
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[400px]">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Atenção</DialogTitle>
                            <DialogDescription>
                                Fique atento as informações abaixo.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 my-4">
                            {
                                evento.temPromocaoTermos?.map(termo => <FormField
                                    key={termo.termo}
                                    control={form.control}
                                    name={`termo_${termo.termo}`}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-y-0 space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />

                                            </FormControl>
                                            <FormLabel className="leading-5 text-justify" dangerouslySetInnerHTML={{ __html: termo.descricao }}></FormLabel>
                                        </FormItem>
                                    )}
                                />)
                            }
                        </div>
                        <DialogFooter>
                            <Button
                                disabled={loading || !form.formState.isValid}
                                className="w-full bg-[#fdaf00] hover:bg-[#feef00] text-black" type="submit">Finalizar pagamento</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
