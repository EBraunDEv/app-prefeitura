import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";




export async function POST(req: NextRequest) {
  const { placa, modelo } = await req.json();
  try {
    const veiculo = await prisma.veiculo.create({
      data: {
        placa,
        modelo,
      },
    });

    return NextResponse.json(veiculo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao cadastrar veículo' }, { status: 500 });
  }
}


export async function GET(req: NextRequest ){
  try {
    const veiculos = await prisma.veiculo.findMany();
    return NextResponse.json(veiculos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar veículos' }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  try {
   
    const veiculo = await prisma.veiculo.delete({
      where: { id, },
    });
    return NextResponse.json(veiculo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar veículo' }, { status: 500 });
  }
}