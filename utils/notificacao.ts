import { prisma } from '@/lib/prisma';
import { Responsavel, Servo } from '@prisma/client';
import { Expo } from 'expo-server-sdk';
import { NotificacaoPayload } from './schema';



export const notificarUsuario = async (
    cpfUsuarioNotificando: string,
    usuariosNotificados: Servo[] | Responsavel[],
    notificationPayload: NotificacaoPayload
): Promise<boolean> => {
    const expo = new Expo();

    let usuariosNotificadosComTokenValido = usuariosNotificados
        .filter((usuario) => Expo.isExpoPushToken(usuario.notificacoesToken))

    if (!usuariosNotificadosComTokenValido.length) {
        throw new Error('Nenhum usuário com token válido foi encontrado')
    }

    const notificacao = await prisma.notificacao.create({
        data: {
            titulo: notificationPayload.titulo,
            descricao: notificationPayload.corpo,
            notificadoPor: {
                connect: {
                    cpf: cpfUsuarioNotificando
                }
            },
            usuariosNotificados: {
                create: usuariosNotificadosComTokenValido.map((usuario) => (
                    "familiaId" in usuario
                        ? { notificadoParaResponsavelId: usuario.id }
                        : { notificadoParaServoId: usuario.id }
                ))
            }
        }
    })

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            to: usuariosNotificadosComTokenValido.map((usuario) => usuario.notificacoesToken),
            title: notificationPayload.titulo,
            body: notificationPayload.corpo,
            data: {
                notificacaoId: notificacao.id,
            },
        })
    })

    // let expoNotificacoes = usuariosNotificadosComTokenValido.map((usuario) => ({
    //     to: usuario.notificacoesToken,
    //     title: notificationPayload.titulo,
    //     body: notificationPayload.corpo,
    //     data: {
    //         notificacaoId: notificacao.id,
    //         usuarioId: usuario.id,
    //         isResponsavel: "familiaId" in usuario
    //     },
    // })) as ExpoPushMessage[]

    // setImmediate(async () => {
    //     let chunks = expo.chunkPushNotifications(expoNotificacoes);

    //     const ticketResults = await Promise.all(
    //         chunks.map(chunk => expo.sendPushNotificationsAsync(chunk)))

    //     const receiptIds = ticketResults
    //         .reduce((allTickets, ticket) => allTickets.concat(...ticket), [])
    //         .filter(ticket => ticket.status === "ok")
    //         .map(ticket => ticket.id)

    //     const receiptChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    //     for (let chunk of receiptChunks) {
    //         const receipts = await expo.getPushNotificationReceiptsAsync(chunk);
    //         for (let [id, receipt] of Object.entries(receipts)) {
    //             if (receipt.status === "ok") {
    //                 continue;
    //             }

    //             console.error(`Erro no recibo`, id, receipt.message);

    //             if (receipt.details?.error === "DeviceNotRegistered" && receipt.details) {
    //                 const params = {
    //                     data: { notificacoesToken: null },
    //                     where: { notificacoesToken: receipt.details?.expoPushToken }
    //                 }

    //                 let isResponsavel = await prisma.responsavel.count({ where: { notificacoesToken: receipt.details?.expoPushToken } })
    //                 isResponsavel
    //                     ? await prisma.responsavel.updateMany(params)
    //                     : await prisma.servo.updateMany(params)
    //             }
    //         }
    //     }
    // })

    return true
} 