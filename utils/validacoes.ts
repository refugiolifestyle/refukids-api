import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import z from "zod";
import { capitalizeWords, onlyNumbers } from "./helpers";

export const idZodValidacao = z.string({ error: "O Campo Id é obrigatório" })

export const cpfZodValidacao = z.string({ error: "O campo Cpf é obrigatório" })
    .min(11, "O campo Cpf esta incompleto")
    .min(14, "O campo Cpf esta incompleto")
    .trim()
    .transform(onlyNumbers)
    .refine(cpf => cpfValidator.isValid(cpf), "O campo Cpf está inválido")

export const nomeZodValidacao = z.string({ error: "O campo Nome é obrigatório" })
    .min(10, "O campo precisa ter 10 caracteres no mínimo")
    .trim()
    .transform(capitalizeWords)

export const fotoZodValidacao = z.url("O campo precisa ser uma URL Válida")
    .trim().optional()

export const dataNascimentoZodValidacao = z.string("O campo Data de nascimento é obrigatório")

export const observacaoZodValidacao = z.string().trim().optional()

export const sexoZodValidacao = z.enum(["Masculino", "Feminino"], { error: "O campo Sexo é obrigatório" })

export const telefoneZodValidacao = z.string({ error: "O campo Telefone é obrigatório" })
    .min(8, "O campo Telefone esta incompleto")
    .max(13, "O campo Telefone esta incompleto")
    .trim()
    .transform(onlyNumbers)

export const parentescoZodValidacao = z.enum(["Pai", "Mae", "Tio", "Tia", "Irmao", "Irma", "AvoM", "AvoF", "Lider", "Outro"], { error: "O campo Parentesco é obrigatório" })

export const enderecoZodValidacao = z.string({ error: "O campo Endereço é obrigatório" })
    .trim()

export const numeroZodValidacao = z.string({ error: "O campo Número é obrigatório" })
    .trim()

export const complementoZodValidacao = z.string()
    .trim()
    .optional()

export const bairroZodValidacao = z.string({ error: "O campo Bairro é obrigatório" })
    .trim()

export const cidadeZodValidacao = z.string({ error: "O campo Cidade é obrigatório" })
    .trim()

export const cepZodValidacao = z.string({ error: "O campo Cep é obrigatório" })
    .trim()
    .length(9, "O campo está incompleto")
    .transform(onlyNumbers)

export const emailZodValidacao = z.email("O campo está inválido")
    .trim()

export const senhaZodValidacao = z.string({ error: "O campo Senha é obrigatório" })
    .min(6, "O campo precisa ter mais de 6 caracteres")

export const participaDeCelulaZodValidacao = z.boolean({ error: "O campo Participa de célula é obrigatório" })

export const redeZodValidacao = z.string()
    .optional()

export const celulaZodValidacao = z.string()
    .optional()

export const notificacoesTokenZodValidacao = z.string({ error: "O campo Notificações é obrigatório" })

export const notificacoesTituloZodValidacao = z.string({ error: "O Campo titulo é obrigatório" })
    .trim()

export const notificacoesCorpoZodValidacao = z.string({ error: "O Campo Corpo é obrigatório" })
    .trim()