export interface Observacao {
    id: string;
    observacao: string;
    servo: string;
    notificado: boolean;
    cadastradoEm: string;
}

export interface Checkin {
    id: string;
    familia: string;
    crianca: string;
    responsavel: string;
    culto: string;
    turma: string;
    impressora: string;
    observacoes: Observacao[];
    cadastradoEm: string;
    recebidaEm: string;
    recebidaFoto?: string;
    recebidaPor: string;
    entregueEm: string;
    entregueFoto?: string;
    entreguePor: string;
    entreguePara: string;
}

export interface Turma {
    turma: string;
    checkins: Checkin[];
}

export interface Culto {
    data: string;
    turmas: Turma[];
}

export interface Notificacao {
    id: string;
    titulo: string;
    imagem?: string;
    corpo: string;
    cadastradoEm: string;
    notificadoPor: string;
}

export interface Usuario {
    uid?: string;
    cpf: string;
    email?: string;
    nome: string;
    foto: string;
    familia: string;
    notificacoes?: Record<string, Notificacao>;
    notificacoesToken?: string;
    cadastradoEm: string;
    cadastroFinalizado: boolean;
}

export interface Crianca {
    id: string;
    nome: string;
    foto: string;
    dataNascimento: string;
    sexo: string;
    observacao?: string;
    familia: string;
    cadastradoEm: string;
    checkins?: string[]; // Referência por ID
}

export interface Responsavel {
    cpf: string;
    nome: string;
    foto: string;
    sexo: string;
    telefone: string;
    parentesco: string;
    familia: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    cep: string;
    cadastradoEm: string;
}

export interface Tio extends Responsavel {} 

export interface Familia {
    id: string;
    nome: string;
    criancas?: Record<string, string>;
    responsaveis?: Record<string, string>;
    tios?: Record<string, string>;
    cadastradoEm: string;
}

export interface Refukids {
    usuarios: Usuario[];
    familias: Familia[];
    cultos: Culto[];
    checkins: Checkin[];
}
