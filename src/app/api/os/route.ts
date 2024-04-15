import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";


export async function GET(req: NextRequest) {
    try {
        const agendamentos = await prisma.agendamentos.findMany({
            select: {
                id: true,
                tipo_servico: true,
                cidadao_cpf: true,
                name: true,
                telefone: true,
                endereco_agendamento: true,
                localidade: true,
                n_agendamento: true,
                ponto_referencia: true,
                observacao: true,
                status: true,
                dataAbertura: true,
                dataAgendamento: true,
                chamados: true,
                motorista: true,
                veiculo: true,
                dataExecucao: true,
            },
        });

        return NextResponse.json({ agendamentos });
    }
    catch (error) {
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


export async function PATCH(req: NextRequest) {
    try {
        const { id, status, motorista, veiculo, dataAgendamento} = await req.json();

        const agendamento = await prisma.agendamentos.update({
            where: {
                id,
            },
            data: {
                status,
                motorista,
                veiculo,
                dataAgendamento,
            },
        });

        return NextResponse.json({ agendamento });
    } catch (error) {
        console.error("Erro ao atualizar o agendamento:", error);

        return NextResponse.json(
            {
                message: "Erro ao atualizar o agendamento",
            },
            {
                status: 500,
            }
        );
    }
}