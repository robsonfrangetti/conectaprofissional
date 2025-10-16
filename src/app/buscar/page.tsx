import { prisma } from "@/lib/prisma";
import Link from "next/link";

type SearchParams = Promise<{ q?: string; categoria?: string; cidade?: string }>

export default async function BuscarPage(props: { searchParams: SearchParams }) {
  const { q, categoria, cidade } = await props.searchParams;

  const where: Record<string, any> = {};
  
  if (q) {
    where.OR = [
      { nome: { contains: q } },
      { descricao: { contains: q } },
    ];
  }
  
  if (categoria) {
    where.categoriaId = categoria;
  }
  
  if (cidade) {
    where.cidade = { contains: cidade };
  }

  const [profissionais, categorias] = await Promise.all([
    prisma.profissional.findMany({
      where,
      orderBy: [{ mediaEstrelas: "desc" }, { totalAvaliacoes: "desc" }],
      include: { categoria: true },
      take: 50,
    }),
    prisma.categoria.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Buscar profissionais</h1>
        <form className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3" method="get">
          <input name="q" defaultValue={q ?? ""} placeholder="Nome ou palavra-chave" className="rounded-md border px-3 py-2" />
          <select name="categoria" defaultValue={categoria ?? ""} className="rounded-md border px-3 py-2">
            <option value="">Todas as categorias</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
          <input name="cidade" defaultValue={cidade ?? ""} placeholder="Cidade" className="rounded-md border px-3 py-2" />
          <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:col-span-3">Buscar</button>
        </form>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {profissionais.length === 0 && <p className="text-gray-500">Nenhum profissional encontrado.</p>}
          {profissionais.map((p) => (
            <div key={p.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{p.nome}</h3>
                  <p className="text-sm text-gray-500">{p.categoria?.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-600 font-medium">{"★".repeat(Math.round(p.mediaEstrelas))}{"☆".repeat(5 - Math.round(p.mediaEstrelas))}</p>
                  <p className="text-xs text-gray-500">{p.totalAvaliacoes} avaliações</p>
                </div>
              </div>
              {p.descricao && <p className="mt-2 text-sm text-gray-700 line-clamp-3">{p.descricao}</p>}
              <div className="mt-3 flex gap-2">
                <Link href={`/profissional/${p.id}`} className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">Ver perfil</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}




