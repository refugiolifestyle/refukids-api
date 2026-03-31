import { PRISMA_ERROR_MESSAGES } from "./schema";

export const capitalizeWords = (palavra?: string) => palavra!.toLocaleLowerCase('pt-BR')
  .replace(/(^|\s)\S/g, l => l.toLocaleUpperCase('pt-BR'));

export const onlyNumbers = (palavra?: string) => palavra!.replace(/[^\d]+/g, '');

export function getPrismaErrorMessage(code?: string): string {
  if (!code) return 'Erro desconhecido.'

  return PRISMA_ERROR_MESSAGES[code] || 'Erro inesperado no banco de dados.'
}