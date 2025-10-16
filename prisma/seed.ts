import { PrismaClient } from "@prisma/client";
import { hash } from "node:crypto";

const prisma = new PrismaClient();

async function main() {
  const categorias = await prisma.categoria.createMany({
    data: [
      { nome: "Advocacia" },
      { nome: "Contabilidade" },
      { nome: "Informática" },
      { nome: "Saúde" },
      { nome: "Construção Civil" },
    ],
    skipDuplicates: true,
  });

  const cat = await prisma.categoria.findFirst({ where: { nome: "Advocacia" } });
  if (!cat) return;

  // senha: 123456 (usar apenas para dev)
  const senhaHash = hash("sha256", Buffer.from("123456")).digest("hex");

  const usuario = await prisma.usuario.upsert({
    where: { email: "demo@conectaprofissional.com.br" },
    update: {},
    create: {
      nome: "Usuário Demo",
      email: "demo@conectaprofissional.com.br",
      senhaHash,
    },
  });

  await prisma.profissional.upsert({
    where: { email: "advogado@conectaprofissional.com.br" },
    update: {},
    create: {
      nome: "Advogado Exemplo",
      email: "advogado@conectaprofissional.com.br",
      descricao: "Especialista em direito trabalhista.",
      cidade: "São Paulo",
      estado: "SP",
      categoriaId: cat.id,
      usuarioId: usuario.id,
      mediaEstrelas: 4.5,
      totalAvaliacoes: 12,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


