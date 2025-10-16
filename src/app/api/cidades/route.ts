import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const estadoId = searchParams.get("estadoId");

    if (!estadoId) {
      return NextResponse.json(
        { error: "Estado ID é obrigatório" },
        { status: 400 }
      );
    }

    const cidades = await prisma.cidade.findMany({
      where: { estadoId },
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
        estadoId: true,
      },
    });

    return NextResponse.json(cidades);
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
