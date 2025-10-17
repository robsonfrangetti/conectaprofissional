import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const [totalUsers, totalProfessionals, totalCategories, totalReviews] = await Promise.all([
      prisma.usuario.count(),
      prisma.profissional.count(),
      prisma.categoria.count(),
      prisma.avaliacao.count(),
    ]);

    return NextResponse.json({
      totalUsers,
      totalProfessionals,
      totalCategories,
      totalReviews,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
