import { Prisma } from "@prisma/client";

export const softDeleteExtension = Prisma.defineExtension({
    name: 'softDelete',
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                // Garante que 'args' seja um objeto para evitar erros de undefined
                args = args ?? {};

                // 1. Lógica de Escrita: Delete -> Update
                if (operation === "delete" || operation === "deleteMany") {
                    const action = operation === "delete" ? "update" : "updateMany";
                    // @ts-ignore - Usamos o query original redirecionando para a ação de update
                    return (query as any)({
                        ...args,
                        operation: action,
                        data: { deletadoEm: new Date() },
                    });
                }

                // 2. Lógica de Leitura: Injeção do filtro deletadoEm
                if (["findMany", "findFirst", "findUnique", "count", "aggregate"].includes(operation)) {
                    // Inicializa o where caso não exista e força o tipo para permitir a escrita
                    const queryArgs = (args as { where?: any }) ?? {};

                    queryArgs.where = {
                        deletadoEm: null,
                        ...queryArgs.where,
                    };

                    if (operation === "findUnique") {
                        return (query as any)({
                            ...queryArgs,
                            operation: "findFirst",
                        });
                    }

                    return query(queryArgs as any);
                }

                return query(args);
            },
        },
    },
});
