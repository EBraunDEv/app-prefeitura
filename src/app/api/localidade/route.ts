import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";


export async function GET(req: NextRequest) {
  try {
    const localidades = await prisma.localidades.findMany();
    return NextResponse.json({ localidades });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao obter a lista de Localidades",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest){
  try {
    const { nome } = await req.json();
    const novaLocalidade = await prisma.localidades.create({
      data: {
        nome,
      },
    });
    return NextResponse.json({ novaLocalidade });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao criar a Localidade",
      },
      {
        status: 500,
      }
    );
  }
}
