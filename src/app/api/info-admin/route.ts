import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const infoAdmin = await prisma.admin.findMany({
        select: {
            name: true,
            email: true,
            password: false,
        },
        });
    
        return NextResponse.json({ infoAdmin });
    } catch (error) {
        return NextResponse.json(
        {
            message: "Erro ao obter a lista de administradores",
        },
        {
            status: 500,
        }
        );
    }
    }