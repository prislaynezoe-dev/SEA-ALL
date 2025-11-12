export const osTypes = [
    { value: 'bl-inspecao', label: 'BL-Inspeção' },
    { value: 'bl-instalacao', label: 'BL-Instalação' },
    { value: 'bl-liberacao-cto', label: 'BL-Liberação de CTO' },
    { value: 'bl-manutencao', label: 'BL-Manutenção' },
    { value: 'bl-mudanca-comodato-1000', label: 'BL-Mudança de comodato /1000' },
    { value: 'bl-mudanca-comodo', label: 'BL-Mudança de Comodo' },
    { value: 'bl-mudanca-endereco', label: 'BL-Mudança de Endereço' },
    { value: 'bl-mudanca-senha', label: 'BL-Mudança de Senha' },
    { value: 'bl-reativacao', label: 'BL-Reativação de cliente suspenso' },
    { value: 'bl-recolhimento', label: 'BL-Recolhimento do Comodato' },
    { value: 'bl-suporte', label: 'BL-Suporte' },
    { value: 'bl-troca-com-mudanca', label: 'BL-TROCA COM MUDANÇA' },
    { value: 'cb-instalacao', label: 'CB-Instalação' },
    { value: 'cb-manutencao', label: 'CB-Manutenção' },
    { value: 'cb-mudanca-comodo', label: 'CB-Mudança de cômodo' },
    { value: 'cb-recolhimento', label: 'CB-Recolhimento dos comodatos' },
    { value: 'cb-suporte', label: 'CB-Suporte' },
    { value: 'inspecao', label: 'INSPEÇÃO' },
    { value: 'mesh-inspecao', label: 'Mesh-inspeção' },
    { value: 'mesh-instalacao', label: 'Mesh-Instalação' },
    { value: 'mesh-recolhimento', label: 'Mesh-Recolhimento do aparelho' },
    { value: 'mesh-suporte', label: 'Mesh-Suporte' },
    { value: 'sea-negociacao', label: 'SEA-Negociação' },
];

const genericDefaults = {
    horario: '08:00 á 18:00 (comercial [AJUSTÁVEL MANUALMENTE])',
    prioridade: 'PADRÃO [AJUSTÁVEL MANUALMENTE]',
    endereco: '(Endereço, CTO, Porta e Metragem)',
};

export const osMasks = {
    'bl-inspecao': {
        defaults: { ...genericDefaults, reclamacao: 'CLIENTE SOLICITA INSPEÇÃO PARA: (relate aqui)', observacao: '(Ex: verificação de quantidade de pontos mesh...)' },
        generate: (data) => `MASCARA DE O.S BL-INSPEÇÃO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'bl-instalacao': {
        defaults: { ...genericDefaults, reclamacao: 'CLIENTE DE ADESÃO', observacao: '(Ex: instalação de cliente novo...)' },
        generate: (data) => `MASCARA DE O.S BL-INSTALAÇÃO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'bl-liberacao-cto': {
        defaults: { ...genericDefaults, reclamacao: 'MUDANÇA DE ENDEREÇO', observacao: '(Ex: cliente solicitação mudança de endereço...)' },
        generate: (data) => `MASCARA DE O.S BL-LIBERAÇÃO DE CTO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'bl-manutencao': {
        defaults: { ...genericDefaults, reclamacao: 'CLIENTE EM LINK LOSS - POSSIVEL ROMPIMENTO DE DROP', observacao: '(Ex: sem conexão, luz vermelha piscando...)' },
        generate: (data) => `MASCARA DE O.S BL-MANUTENÇÃO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'bl-mudanca-comodato-1000': {
        defaults: { ...genericDefaults, reclamacao: 'CLIENTE SOLICITA TROCA DE EQUIPAMENTO', observacao: '(Ex: cliente trocou de plano, necessário troca de equipamento - troca de equipamento por solicitação do cliente, etc...)' },
        generate: (data) => `MASCARA DE O.S BL-MUDANÇA DE COMODATO/1000

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'bl-mudanca-comodo': {
        defaults: { ...genericDefaults, reclamacao: 'CLIENTE SOLICITA MUDANÇA DE COMODO', observacao: '(Ex: da sala para o quarto, etc...)' },
        generate: (data) => `MASCARA DE O.S BL-MUDANÇA DE COMODO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'bl-mudanca-endereco': {
        defaults: { ...genericDefaults, reclamacao: 'MUDANÇA DE ENDEREÇO', endereco: '(Endereço, CTO, Porta e Metragem)', observacao: '' },
        generate: (data) => `MASCARA DE O.S BL-MUDANÇA DE ENCEREÇO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
NOVO ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'bl-mudanca-senha': {
        defaults: { ...genericDefaults, reclamacao: 'CLIENTE SOLICITA MUDANÇA DE SENHA', observacao: '(Ex: lentidão, oscilação...)' },
        generate: (data) => `MASCARA DE O.S BL-MUDANÇA DE SENHA

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSEVAÇÃO: ${data.observacao}`
    },
    'bl-reativacao': {
        defaults: { ...genericDefaults, reclamacao: 'CLIENTE SOLICITA REATIVAÇÃO DE CONTRATO SUSPENSO, APÓS TERMINO DE PRAZO', observacao: '(relate aqui...)' },
        generate: (data) => `MASCARA DE O.S BL-REATIVAÇÃO DE CLIENTE SUSPENSO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'bl-recolhimento': {
        defaults: { ...genericDefaults, reclamacao: 'REALIZAR RECOLHIMENTO DE EQUIPAMENTO EM COMODATO', observacao: '(Ex: cliente cancelado, cliente suspenso...)' },
        generate: (data) => `MASCARA DE O.S BL-RECOLHIMENTO DO COMODATO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'bl-suporte': {
        defaults: { ...genericDefaults, reclamacao: 'CLIENTE SOLICITA SUPORTE - POTÊNCIA ( ), TEMPERATURA ( )', observacao: '(Ex: cliente relata lentidão em site especificos, oscilação de conexão quando esta no quintal, temperatura elevada...)' },
        generate: (data) => `MASCARA DE O.S BL-SUPORTE

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'bl-troca-com-mudanca': {
        defaults: { ...genericDefaults, reclamacao: 'MUDANÇA DE ENDEREÇO COM TROCA DE TITULARIDADE', observacao: '(relate aqui)' },
        generate: (data) => `MASCARA DE O.S BL-TROCA COM MUDANÇA

HORÁRIO DE ATENDimento: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'cb-instalacao': {
        defaults: { ...genericDefaults, reclamacao: '(relate aqui)', observacao: '(relate aqui)' },
        generate: (data) => `MASCARA DE O.S CB-INSTALAÇÃO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'cb-manutencao': {
        defaults: { ...genericDefaults, reclamacao: '(relate aqui)', observacao: '(relate aqui)' },
        generate: (data) => `MASCARA DE O.S CB-MANUTENÇÃO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'cb-mudanca-comodo': {
        defaults: { ...genericDefaults, reclamacao: '(relate aqui)', observacao: '(relate aqui)' },
        generate: (data) => `MASCARA DE O.S CB-MUDANÇA DE COMODO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'cb-recolhimento': {
        defaults: { ...genericDefaults, reclamacao: '(relate aqui)', observacao: '(relate aqui)' },
        generate: (data) => `MASCARA DE O.S CB-RECOLHIMENTO DOS COMODADOS

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'cb-suporte': {
        defaults: { ...genericDefaults, reclamacao: '(relate aqui)', observacao: '(relate aqui)' },
        generate: (data) => `MASCARA DE O.S CB-SUPORTE

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'inspecao': {
        defaults: { ...genericDefaults, reclamacao: '(relate aqui)', observacao: '(relate aqui)' },
        generate: (data) => `MASCARA DE O.S INSPEÇÃO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'mesh-inspecao': {
        defaults: { ...genericDefaults, reclamacao: 'CLIENTE SOLICITA INSPEÇÃO PARA VERIFICAÇÃO DE QUANTIDADE DE PONTOS MESH\'s NECESSÁRIOS.', observacao: '(oscilação de conexão, sem alcance de wi-fi na casa toda)' },
        generate: (data) => `MASCARA DE O.S MESH-INSPEÇÃO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'mesh-instalacao': {
        defaults: { ...genericDefaults, reclamacao: 'INSTALAÇÃO DE EQUIPAMENTO MESH', observacao: '(um ponto mesh, dois pontos meshs)' },
        generate: (data) => `MASCARA DE O.S MESH-INSTALAÇÃO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'mesh-recolhimento': {
        defaults: { ...genericDefaults, reclamacao: 'RECOLHIMENTO DE EQUIPAMENTO MESH', observacao: '(contrato mesh cancelado, etc...)' },
        generate: (data) => `MASCARA DE O.S MESH-RECOLHIMENTO DO APARELHO

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'mesh-suporte': {
        defaults: { ...genericDefaults, reclamacao: 'REALIZAR SUPORTE EM EQUIPAMENTO MESH', observacao: '(lentidão apenas no equipamento mesh, etc...)' },
        generate: (data) => `MASCARA DE O.S MESH-SUPORTE

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
    'sea-negociacao': {
        defaults: { ...genericDefaults, reclamacao: '(relate aqui)', observacao: '(relate aqui)' },
        generate: (data) => `MASCARA DE O.S SEA-Negociação

HORÁRIO DE ATENDIMENTO: ${data.horario}
PRIORIDADE: ${data.prioridade}
QUEM VAI RECEBER A EQUIPE: ${data.quemRecebe}
ENDEREÇO: ${data.endereco}

RECLAMAÇÃO DO CLIENTE: ${data.reclamacao}
OBSERVAÇÃO: ${data.observacao}`
    },
};
