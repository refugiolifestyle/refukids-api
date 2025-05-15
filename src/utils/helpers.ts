export const capitalizeWords = (palavra?: string) => palavra!.toLocaleLowerCase('pt-BR')
    .replace(/(^|\s)\S/g, l => l.toLocaleUpperCase('pt-BR'));

export const onlyNumbers = (palavra?: string) => palavra!.replaceAll(/[^\d]+/g, '');   