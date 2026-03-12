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