const { PrismaClient } = require("@prisma/client");
const { createHash } = require("node:crypto");

const prisma = new PrismaClient();

async function main() {
  const categorias = [
    "Advocacia",
    "Contabilidade",
    "Informática",
    "Saúde",
    "Construção Civil",
  ];

  for (const nome of categorias) {
    await prisma.categoria.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }

  const cat = await prisma.categoria.findFirst({ where: { nome: "Advocacia" } });
  if (!cat) return;

  const senhaHash = createHash("sha256").update("123456").digest("hex");

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
      mediaEstrelas: 5,
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


