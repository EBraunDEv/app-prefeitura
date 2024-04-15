import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";


export  async function POST(req: NextRequest) {
    const { nome, cnh, telefone } = await req.json();
    try {
        const motorista = await prisma.motorista.create({
            data: {
                nome,
                cnh,
                telefone,
            },
        });

        return NextResponse.json(motorista);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao cadastrar motorista' }, { status: 500 });
    }
}

export async function GET(req: NextRequest ){
    try {
        const motoristas = await prisma.motorista.findMany();
        return NextResponse.json(motoristas);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao buscar motoristas' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
    try {
        const motorista = await prisma.motorista.delete({
            where: { id, },
        });
        return NextResponse.json(motorista);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao deletar motorista' }, { status: 500 });
    }
}