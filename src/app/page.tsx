import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: "asc" } });

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-4xl font-bold">ConectaProfissional</h1>
        <p className="mt-2 text-lg text-gray-600">Encontre profissionais de confiança em qualquer área.</p>
        <div className="mt-8 flex gap-3">
          <Link href="/buscar" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Buscar profissionais</Link>
        </div>
        <div className="mt-12">
          <h2 className="text-xl font-semibold">Categorias</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {categorias.length === 0 && <p className="text-gray-500">Sem categorias ainda.</p>}
            {categorias.map((c) => (
              <Link key={c.id} href={`/buscar?categoria=${encodeURIComponent(c.id)}`} className="rounded-md border p-4 hover:bg-gray-50">
                <span className="font-medium">{c.nome}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
