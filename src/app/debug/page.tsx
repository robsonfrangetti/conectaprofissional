import { prisma } from "@/lib/prisma";

export default async function DebugPage() {
  try {
    const categorias = await prisma.categoria.findMany();
    const profissionais = await prisma.profissional.findMany();
    const usuarios = await prisma.usuario.findMany();

    return (
      <main className="min-h-screen bg-white text-gray-900 p-8">
        <h1 className="text-2xl font-bold mb-4">Debug - Conexão com Banco</h1>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Categorias ({categorias.length})</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(categorias, null, 2)}
          </pre>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Profissionais ({profissionais.length})</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(profissionais, null, 2)}
          </pre>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Usuários ({usuarios.length})</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(usuarios, null, 2)}
          </pre>
        </div>

        <div className="text-sm text-gray-500">
          <p>Timestamp: {new Date().toISOString()}</p>
          <p>DATABASE_URL configurada: {process.env.DATABASE_URL ? 'Sim' : 'Não'}</p>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen bg-white text-gray-900 p-8">
        <h1 className="text-2xl font-bold mb-4">Erro de Conexão</h1>
        <div className="bg-red-100 p-4 rounded">
          <pre className="text-red-800">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </pre>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>Timestamp: {new Date().toISOString()}</p>
          <p>DATABASE_URL configurada: {process.env.DATABASE_URL ? 'Sim' : 'Não'}</p>
        </div>
      </main>
    );
  }
}
