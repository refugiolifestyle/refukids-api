import { softDeleteExtension } from "@/prisma/extentions/softDelete";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// 1. Defina o tipo do cliente estendido para o Global
type PrismaClientExtended = ReturnType<typeof createExtendedClient>;

const globalForPrisma = global as unknown as {
    prisma: PrismaClientExtended | undefined;
};

// 2. Função que cria a instância e aplica a extensão
function createExtendedClient() {

    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const baseClient = new PrismaClient({
        adapter
    });

    return baseClient.$extends(softDeleteExtension);
}

// 3. Exporta a instância (Singleton)
export const prisma = globalForPrisma.prisma ?? createExtendedClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
