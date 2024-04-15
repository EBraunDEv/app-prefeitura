import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const servicos = await prisma.servicos.findMany();
    return NextResponse.json({ servicos });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao obter a lista de cidadãos",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  const { tipo_servico,  } = await req.json();
  try {
    const servicos = await prisma.servicos.create({
      data: {
        tipo_servico,
      },
    });
    return NextResponse.json({ message: "ok criado", servicos });
  } catch (error) {
    return NextResponse.json({
      message: "Erro ao criar o serviço",
    });
  }
}

export async function PUT(req: NextRequest) {
  const { id, tipo_servico, setor, secretariaId } = await req.json();
  try {
    const servicos = await prisma.servicos.update({
      where: {
        id,
      },
      data: {
        tipo_servico,
      },
    });
    return NextResponse.json({ message: "ok atualizado", servicos });
  } catch (error) {
    return NextResponse.json({
      message: "Erro ao atualizar o serviço",
    });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  try {
    const servicos = await prisma.servicos.delete({
      where: {
        id,
      },
    });
    return NextResponse.json({ message: "ok deletado", servicos });
  } catch (error) {
    return NextResponse.json({
      message: "Erro ao deletar o serviço",
    });
  }
}
