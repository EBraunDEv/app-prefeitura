import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const cidadaos = await prisma.cidadao.findMany({
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

        password: false,
      },
    });

    return NextResponse.json({ cidadaos });
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
  const {
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

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const cidadao = await prisma.cidadao.create({
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
            password: hashedPassword,
        },
    });
    return NextResponse.json({ message: "ok criado", cidadao });
} catch (error) {
    return NextResponse.json(
        {
            message: "Erro ao criar o cidadao",
        },
        {
            status: 500,
        }
    );
}
}


export async function PUT(req: NextRequest) {
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
      where: { id },
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
    return Response.json({ message: "ok atualizado", cidadao });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao atualizar o cidadao",
      },
      {
        status: 500,
      }
    );
  }
  return NextResponse.json(
    {
      message: "Erro ao atualizar o cidadao",
    },
    {
      status: 500,
    }
  );
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    const cidadao = await prisma.cidadao.delete({
      where: { id },
    });
    return Response.json({ message: "ok deletado", cidadao });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Erro ao deletar o cidadao",
      },
      {
        status: 500,
      }
    );
  }
}
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
      { message: "O CPF pertence ao....", cidadao },
      {
        status: 201,
      }
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


