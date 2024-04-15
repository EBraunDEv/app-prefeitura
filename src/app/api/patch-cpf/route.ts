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
      },
    });
    return Response.json(
      {
        message: "O CPF pertence ao....",
        cidadao: {
          name: cidadao.name,
          cpf: cidadao.cpf,
          n_instalacao: cidadao.n_instalacao,
          telefone: cidadao.telefone,
          endereco: cidadao.endereco,
          n_casa: cidadao.n_casa,
          bairro: cidadao.bairro,
          ponto_referencia: cidadao.ponto_referencia,
          email: cidadao.email,
        },
      },
      { status: 200 }
    );
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

export async function GET(req: NextRequest) {
  const { cpf } = await req.json();

  try {
    const cidadao = await prisma.cidadao.findUnique({
      select: {
        name: true,
        cpf: true,
        n_instalacao: true,
        telefone: true,
        endereco: true,
        n_casa: true,
        bairro: true,
        ponto_referencia: true,
        email: true,
      },
      where: {
        cpf: cpf as string,
      },
    });

    if (cidadao) {
      return NextResponse.json(
        {
          message: "Informações do cidadão encontradas",
          cidadao: {
            name: cidadao.name,
            cpf: cidadao.cpf,
            n_instalacao: cidadao.n_instalacao,
            telefone: cidadao.telefone,
            endereco: cidadao.endereco,
            n_casa: cidadao.n_casa,
            bairro: cidadao.bairro,
            ponto_referencia: cidadao.ponto_referencia,
            email: cidadao.email,
          },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Cidadão não encontrado",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao buscar informações do cidadão",
      },
      { status: 500 }
    );
  }
}


