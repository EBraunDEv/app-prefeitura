import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
    const { email, password, name } = await req.json();

    try {
        const adminExists = await prisma.admin.findUnique({
            where: { email },
        });

        if (adminExists) {
            return NextResponse.json(
                { message: "Admin já existe" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        const token = jwt.sign({ email: newAdmin.email }, "your-secret-key");

        return NextResponse.json(
            { message: "Admin adicionado com sucesso", admin: newAdmin, token },
            { status: 200 }
        );
    } catch (error) {
        console.log("Erro:", error);
        return NextResponse.json(
            {
                message: "Erro ao processar a solicitação de adicionar admin",
            },
            {
                status: 500,
            }
        );
    }
}
