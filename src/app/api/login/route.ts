import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { cpf, password } = await req.json();

  try {
    const cidadao = await prisma.cidadao.findUnique({
      where: { cpf },
    });

    if (!cidadao) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    if (cidadao && password && cidadao.password) {
      const isMatch = await bcrypt.compare(password, cidadao.password);

      if (isMatch) {
        const token = jwt.sign({ cpf: cidadao.cpf }, "your-secret-key");

        return NextResponse.json(
          { message: "Login bem-sucedido", cidadao, token },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      { message: "Credenciais inválidas" },
      { status: 401 }
    );
  } catch (error) {
    console.log("Erro:", error);
    return NextResponse.json(
      {
        message: "Erro ao processar a solicitação de login",
      },
      {
        status: 500,
      }
    );
  }
}