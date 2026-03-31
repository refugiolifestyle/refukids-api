import { Sexo } from "@prisma/client";

export interface Endereco {
    endereco?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    cep?: string;
}

export interface NotificacaoPayload {
    titulo?: string;
    corpo: string;
}

export interface JWTKeycloakRolesPayload {
    realm_access?: {
        roles: string[];
    };
    resource_access?: {
        [clientId: string]: {
            roles: string[];
        };
    };

    picture?: string
    celula?: string,
    birthdate: string,
    gender: Sexo,
    cpf: string,
    name: string,
    phone_number: string,
    preferred_username: string,
    full_address: string,
    given_name: string,
    family_name: string,
    email: string,

    [propsName: string]: any
}

export const PRISMA_ERROR_MESSAGES: Record<string, string> = {
    P2000: 'Um dos campos excedeu o tamanho permitido.',
    P2001: 'Registro não encontrado.',
    P2002: 'Já existe um registro com esse valor único.',
    P2003: 'Falha de relacionamento (chave estrangeira inválida).',
    P2004: 'Erro de restrição no banco de dados.',
    P2005: 'Valor inválido armazenado no banco.',
    P2006: 'Valor fornecido é inválido para o campo.',
    P2007: 'Erro de validação de dados.',
    P2008: 'Erro ao processar a consulta.',
    P2009: 'Consulta inválida.',
    P2010: 'Erro ao executar query no banco.',
    P2011: 'Campo obrigatório não pode ser nulo.',
    P2012: 'Campo obrigatório não informado.',
    P2013: 'Argumento obrigatório não informado.',
    P2014: 'Operação viola um relacionamento obrigatório.',
    P2015: 'Registro relacionado não encontrado.',
    P2016: 'Erro ao interpretar a consulta.',
    P2017: 'Registros não estão conectados corretamente.',
    P2018: 'Registros obrigatórios não encontrados.',
    P2019: 'Erro nos dados enviados.',
    P2020: 'Valor fora do intervalo permitido.',
    P2021: 'Tabela não existe no banco de dados.',
    P2022: 'Coluna não existe no banco de dados.',
    P2023: 'Dados inconsistentes no banco.',
    P2024: 'Tempo excedido ao conectar com o banco.',
    P2025: 'Registro necessário não encontrado.',
    P2026: 'Funcionalidade não suportada pelo banco.',
    P2027: 'Múltiplos erros ocorreram no banco.',
    P2028: 'Erro na transação.',
    P2029: 'Limite de parâmetros da query excedido.',
    P2030: 'Índice de busca não encontrado.',
    P2031: 'Banco precisa estar configurado como replica set.',
    P2033: 'Número muito grande para o tipo suportado.',
    P2034: 'Conflito de transação (deadlock). Tente novamente.',
    P2035: 'Erro interno no banco de dados.',
    P2036: 'Erro em conector externo.',
    P2037: 'Muitas conexões abertas no banco.',
}