import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { database } from "@/configs/firebase"
import { get, onValue, ref, Unsubscribe } from "firebase/database"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { StepProps, Steps } from ".."
import { PagamentoMoneyModal } from "../pagamento-money-modal"

type PagamentoResponse = {
    message?: string
    checkout?: string
    txid?: string
}

export default function Pagamentos({ setStep, inscrito, evento }: StepProps) {
    const [pagando, setPagando] = useState(false)
    const [pagamento, setPagamento] = useState<PagamentoResponse>()
    const [meioPagamento, setMeioPagamento] = useState<"pix" | "credit_card" | "money" | "infinitepay">('infinitepay')

    useEffect(() => {
        if (pagamento) {
            let pagamentoSubs: Unsubscribe;
            window.open(pagamento.checkout, '_self');

            (async () => {
                const refInscritoKit = ref(database, `eventos/${evento.id}/kits/${inscrito?.cpf}`)
                const snapshotInscritoKit = await get(refInscritoKit);

                const refPagamentoStatus = ref(database, `eventos/${evento.id}/inscricoes/${inscrito?.cpf}/pagamentos/${pagamento.txid}/status`)
                pagamentoSubs = onValue(refPagamentoStatus, snapStatus => {
                    if (['CONCLUIDA', 'paid'].includes(snapStatus.val())) {
                        setStep(snapshotInscritoKit.exists() ? Steps.FINALIZACAO_COM_KIT : Steps.FINALIZACAO)
                    }
                })
            })();

            return () => pagamentoSubs();
        }
    }, [pagamento]);

    async function onSubmit() {
        setPagando(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/eventos/${evento.id}/inscricoes/${inscrito?.cpf}/pagamento/${meioPagamento}`, {
                method: 'POST',
                body: JSON.stringify(inscrito?.pagamentosAFazer)
            })

            if (!response.ok) {
                const { message } = await response.json()
                throw message
            }

            const data = await response.json() as PagamentoResponse

            if (!response.ok) {
                alert(data.message)
                return false
            }

            if (meioPagamento === "money") {
                setStep(Steps.FINALIZACAO_MONEY);
                return true
            } else {
                alert('Atenção: não feche ou saia desta página até que a confirmação de pagamento seja exibida.')
                setPagamento(data)
            }
        } catch (e: any) {
            alert(`Falha ao gerar o pagamento. (${e})`)

            setPagamento(undefined)
            setPagando(false)
        }
    }

    const pagamentoTotaisPix = inscrito?.pagamentosAFazer?.reduce((a, p) => a + p.valores['pix'], 0)
    const pagamentoTotaisCartao = inscrito?.pagamentosAFazer?.reduce((a, p) => a + p.valores['credit_card'], 0)
    const pagamentoTotaisMoney = inscrito?.pagamentosAFazer?.reduce((a, p) => a + p.valores['money'], 0)
    const pagamentoTotaisInfinitePay = inscrito?.pagamentosAFazer?.reduce((a, p) => a + p.valores['infinitepay'], 0)

    return <>
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Pagamento</CardTitle>
                <CardDescription>Selecione a forma de pagamento que deseja utilizar</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
                {
                    evento.tiposPagamentos?.includes("infinitepay")
                    && <Button
                        variant={"ghost"}
                        disabled={pagando}
                        onClick={() => setMeioPagamento("infinitepay")}
                        className={`border w-full h-full max-h-[80px] flex flex-col justify-between items-start px-4 py-2 space-y-2 ${meioPagamento === "infinitepay" ? 'bg-muted border border-[#fdaf00]' : ''}`}>
                        <h1 className="text-left text-lg font-semibold">Pix/Cartão de Crédito</h1>
                        <ul className="text-left text-xs font-light">
                            <li><b>Total:</b> {pagamentoTotaisInfinitePay?.toLocaleString('pt-BR', { currency: "BRL", style: "currency" })}</li>
                        </ul>
                    </Button>
                }
                {
                    evento.tiposPagamentos?.includes("pix")
                    && <Button
                        variant={"ghost"}
                        disabled={pagando}
                        onClick={() => setMeioPagamento("pix")}
                        className={`border w-full h-full max-h-[80px] flex flex-col justify-between items-start px-4 py-2 space-y-2 ${meioPagamento === "pix" ? 'bg-muted border border-[#fdaf00]' : ''}`}>
                        <h1 className="text-left text-lg font-semibold">Pix</h1>
                        <ul className="text-left text-xs font-light">
                            <li><b>Total:</b> {pagamentoTotaisPix?.toLocaleString('pt-BR', { currency: "BRL", style: "currency" })}</li>
                        </ul>
                    </Button>
                }
                {
                    evento.tiposPagamentos?.includes("credit_card")
                    && <Button
                        variant={"ghost"}
                        disabled={pagando}
                        onClick={() => setMeioPagamento("credit_card")}
                        className={`border w-full h-full max-h-[80px] flex flex-col justify-between items-start px-4 py-2 space-y-2 ${meioPagamento === "credit_card" ? 'bg-muted border border-[#fdaf00]' : ''}`}>
                        <h1 className="text-left text-lg font-semibold">Cartão de crédito</h1>
                        <ul className="text-left text-xs font-light">
                            <li><b>Total:</b> {pagamentoTotaisCartao?.toLocaleString('pt-BR', { currency: "BRL", style: "currency" })}</li>
                        </ul>
                    </Button>
                }
                {
                    evento.tiposPagamentos?.includes("money")
                    && <Button
                        variant={"ghost"}
                        disabled={pagando}
                        onClick={() => setMeioPagamento("money")}
                        className={`border w-full h-full max-h-[80px] flex flex-col justify-between items-start px-4 py-2 space-y-2 ${meioPagamento === "money" ? 'bg-muted border border-[#fdaf00]' : ''}`}>
                        <h1 className="text-left text-lg font-semibold">Dinheiro</h1>
                        <ul className="text-left text-xs font-light">
                            <li><b>Total:</b> {pagamentoTotaisMoney?.toLocaleString('pt-BR', { currency: "BRL", style: "currency" })}</li>
                        </ul>
                    </Button>
                }
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                {
                    evento.temPromocao && evento.temPromocaoMeiosPagamentos?.includes(meioPagamento)
                        ? <PagamentoMoneyModal loading={pagando} onSubmit={onSubmit} evento={evento} />
                        : <Button
                            disabled={pagando}
                            onClick={onSubmit}
                            className="w-full bg-[#fdaf00] hover:bg-[#feef00] text-black gap-2">
                            {
                                pagando
                                    ? <>
                                        <Loader2 className="animate-spin" />
                                        Registrando o pagamento
                                    </>
                                    : 'Pagar'
                            }

                        </Button>
                }
                <a href="#" className="text-sm" onClick={() => setStep(s => evento.pagamentos.length > 1 ? s - 1 : s - 2)}>
                    Voltar
                </a>
            </CardFooter>
        </Card>
    </>
}