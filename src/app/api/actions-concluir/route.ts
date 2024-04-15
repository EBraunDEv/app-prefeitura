import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/db'



export async function PATCH(req: NextRequest) {
    try {
        const { id, status, dataExecucao } = await req.json()

        const agendamento = await prisma.agendamentos.update({
            where: {
                id,
            },
            data: {
                status,
                dataExecucao
            },
        })

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