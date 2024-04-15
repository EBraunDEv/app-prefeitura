import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    if (admin && password && admin.password) {
      const isMatch = await bcrypt.compare(password, admin.password);

      if (isMatch) {
        const token = jwt.sign({ email: admin.email }, "your-secret-key");

        return NextResponse.json(
          { message: "Login bem-sucedido", admin, token },
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
