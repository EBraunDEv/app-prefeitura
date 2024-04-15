import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { format } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    
    const agendamentos = await prisma.agendamentos.findMany({
      select: {
        id: true,
        tipo_servico: true,
        cidadao_cpf: true,
        name: true,
        telefone: true,
        bairro: true,
        endereco_agendamento: true,
        localidade: true,
        n_agendamento: true,
        ponto_referencia: true,
        observacao: true,
        status: true,
        dataAbertura: true,
        chamados: true,
        motorista: true,
        veiculo: true,
        dataAgendamento: true,
        dataExecucao: true,
        dataRemarcacao: true,
        obs_motorista: true,
      },
    });

    return NextResponse.json({ agendamentos });
  } catch (error) {
    console.error("Erro ao obter a lista de agendamentos:", error);

    return NextResponse.json(
      {
        message: "Erro ao obter a lista de agendamentos",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      tipo_servico,
      cidadao_cpf,
      name,
      telefone,
      bairro,
      endereco_agendamento,
      localidade,
      n_agendamento,
      ponto_referencia,
      observacao,
      status,
      dataAbertura,
    } = await req.json();

    // Verificar se já existe um agendamento não concluído para o cidadão
    const existingAgendamento = await prisma.agendamentos.findFirst({
      where: {
        cidadao_cpf,
        status: {
          not: 'Concluído',
        },
      },
    });

    if (existingAgendamento) {
      return NextResponse.json(
        {
          message: "Já existe um agendamento não concluído para este cidadão.",
        },
        {
          status: 400,
        }
      );
    }

    // Recupere o último agendamento
    const lastAgendamento = await prisma.agendamentos.findFirst({
      orderBy: {
        id: 'desc',
      },
    });

    let chamadosNovo;
    if (lastAgendamento && lastAgendamento.chamados) {
      const lastChamadoNumber = parseInt(lastAgendamento.chamados.toString());
      chamadosNovo = lastChamadoNumber + 1;
    } else {
      chamadosNovo = 1;
    }


    // Formatar a data e a hora no formato 'DD/MM/YYYY HH:mm:ss'
    const dataFormatada = format(new Date(dataAbertura), 'dd/MM/yyyy HH:mm:ss');

    const agendamento = await prisma.agendamentos.create({
      data: {
        tipo_servico,
        cidadao_cpf,
        name,
        telefone,
        bairro,
        endereco_agendamento,
        localidade,
        n_agendamento,
        ponto_referencia,
        observacao,
        status,
        chamados: chamadosNovo,
        dataAbertura: dataFormatada,
      },
    });
    
    return NextResponse.json({ agendamento });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao criar o registro",
      },
      {
        status: 500,
      }
    );
  }
}


export async function PATCH(req: NextRequest) {
  const { cpf } = await req.json();
  try {
    console.log("CPF fornecido:", cpf);
    const agendamento = await prisma.agendamentos.findFirst({
      where: { cidadao_cpf: cpf },
    });

    const agendamentos = await prisma.agendamentos.findMany({
      where: {
        cidadao_cpf: cpf,
      },
      select: {
        id: true,
        tipo_servico: true,
        cidadao_cpf: true,
        name: true,
        telefone: true,
        bairro: true,
        endereco_agendamento: true,
        localidade: true,
        n_agendamento: true,
        ponto_referencia: true,
        observacao: true,
        status: true,
        dataAbertura: true,
        chamados: true,
        dataAgendamento: true,
        dataRemarcacao: true,
        dataExecucao: true,
      },
    });

    return NextResponse.json({ agendamentos });
  } catch (error) {
    console.error("Erro ao obter a lista de agendamentos:", error);

    return NextResponse.json(
      {
        message: "Erro ao obter a lista de agendamentos",
      },
      {
        status: 500,
      }
    );
  }
}


