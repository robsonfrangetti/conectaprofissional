import { prisma } from "@/lib/prisma";
import Link from "next/link";

type SearchParams = Promise<{ q?: string; categoria?: string; cidade?: string }>

export default async function BuscarPage(props: { searchParams: SearchParams }) {
  const { q, categoria, cidade } = await props.searchParams;

  const where: Record<string, unknown> = {};
  
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ConectaProfissional</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-600">Início</Link>
              <Link href="/buscar" className="text-blue-600 font-medium">Profissionais</Link>
              <Link href="/cadastro" className="text-gray-900 hover:text-blue-600">Cadastrar-se</Link>
              <Link href="/contato" className="text-gray-900 hover:text-blue-600">Contato</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Encontre o profissional ideal
          </h1>
          <p className="text-xl text-gray-600">
            Busque com precisão com nossos filtros
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4" method="get">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome ou palavra-chave
              </label>
              <input 
                name="q" 
                defaultValue={q ?? ""} 
                placeholder="Ex: Advogado trabalhista" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select 
                name="categoria" 
                defaultValue={categoria ?? ""} 
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas as categorias</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input 
                name="cidade" 
                defaultValue={cidade ?? ""} 
                placeholder="Ex: São Paulo" 
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                Procurar
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Profissionais disponíveis ({profissionais.length})
          </h2>
          
          {profissionais.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum profissional encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros de busca ou explore todas as categorias.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profissionais.map((p) => (
                <div key={p.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{p.nome}</h3>
                      <p className="text-sm text-blue-600 font-medium">{p.categoria?.nome}</p>
                      {p.cidade && (
                        <p className="text-sm text-gray-500">📍 {p.cidade}, {p.estado}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-1">
                        <span className="text-yellow-400 text-lg">
                          {"★".repeat(Math.round(p.mediaEstrelas))}
                        </span>
                        <span className="text-gray-300 text-lg">
                          {"☆".repeat(5 - Math.round(p.mediaEstrelas))}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{p.totalAvaliacoes} avaliações</p>
                    </div>
                  </div>
                  
                  {p.descricao && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-3">{p.descricao}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/profissional/${p.id}`} 
                      className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Ver perfil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}




