import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const estados = await prisma.estado.findMany({
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
        uf: true,
      },
    });

    return NextResponse.json(estados);
  } catch (error) {
    console.error("Erro ao buscar estados:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
