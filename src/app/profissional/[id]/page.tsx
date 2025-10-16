import { prisma } from "@/lib/prisma";

export default async function ProfissionalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profissional = await prisma.profissional.findUnique({
    where: { id },
    include: { categoria: true, avaliacoes: { include: { autor: true }, orderBy: { createdAt: "desc" }, take: 10 } },
  });

  if (!profissional) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Profissional não encontrado.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold">{profissional.nome}</h1>
        <p className="text-gray-600">{profissional.categoria?.nome}</p>
        {profissional.descricao && <p className="mt-3 text-gray-800">{profissional.descricao}</p>}
        <div className="mt-4 text-sm text-gray-700">
          <p>
            <span className="font-medium">Avaliação:</span> {"★".repeat(Math.round(profissional.mediaEstrelas))}{"☆".repeat(5 - Math.round(profissional.mediaEstrelas))} ({profissional.totalAvaliacoes})
          </p>
          <p className="mt-1"><span className="font-medium">Email:</span> {profissional.email}</p>
          <p className="mt-1"><span className="font-medium">Telefone:</span> <span className="italic text-gray-500">visível após login</span></p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold">Avaliações recentes</h2>
          <div className="mt-3 space-y-3">
            {profissional.avaliacoes.length === 0 && <p className="text-gray-500">Ainda não há avaliações.</p>}
            {profissional.avaliacoes.map((a) => (
              <div key={a.id} className="rounded-md border p-3">
                <p className="text-yellow-700">{"★".repeat(a.estrelas)}{"☆".repeat(5 - a.estrelas)}</p>
                {a.comentario && <p className="text-sm mt-1">{a.comentario}</p>}
                <p className="text-xs text-gray-500 mt-1">por {a.autor.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}




