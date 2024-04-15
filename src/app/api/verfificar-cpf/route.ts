import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const {
    id,
    name,
    cpf,
    n_instalacao,
    telefone,
    endereco,
    n_casa,
    bairro,
    ponto_referencia,
    email,
    password,
  } = await req.json();

  try {
    const cidadao = await prisma.cidadao.update({
      where: { cpf },
      data: {
        name,
        cpf,
        n_instalacao,
        telefone,
        endereco,
        n_casa,
        bairro,
        ponto_referencia,
        email,
        password,
      },
    });
    return Response.json({ message: "O CPF pertence ao....", cidadao });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro, o cidadão não esta cadastrado ou o cpf esta errado!",
      },
      {
        status: 500,
      }
    );
  }
}
