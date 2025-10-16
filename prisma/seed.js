const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar categorias
  const categorias = [
    { nome: 'Advogado' },
    { nome: 'Nutricionista' },
    { nome: 'Desenvolvedor' },
    { nome: 'Designer' },
    { nome: 'Contador' },
    { nome: 'Psicólogo' },
    { nome: 'Personal Trainer' },
    { nome: 'Consultor Financeiro' },
    { nome: 'Fotógrafo' },
    { nome: 'Marketing Digital' },
  ];

  console.log('📋 Criando categorias...');
  for (const categoria of categorias) {
    await prisma.categoria.upsert({
      where: { nome: categoria.nome },
      update: {},
      create: categoria,
    });
  }

  // Criar estados
  const estados = [
    { nome: 'São Paulo', uf: 'SP' },
    { nome: 'Rio de Janeiro', uf: 'RJ' },
    { nome: 'Minas Gerais', uf: 'MG' },
    { nome: 'Bahia', uf: 'BA' },
    { nome: 'Paraná', uf: 'PR' },
    { nome: 'Rio Grande do Sul', uf: 'RS' },
    { nome: 'Pernambuco', uf: 'PE' },
    { nome: 'Ceará', uf: 'CE' },
    { nome: 'Pará', uf: 'PA' },
    { nome: 'Santa Catarina', uf: 'SC' },
  ];

  console.log('🗺️ Criando estados...');
  for (const estado of estados) {
    await prisma.estado.upsert({
      where: { uf: estado.uf },
      update: {},
      create: estado,
    });
  }

  // Criar cidades
  const cidades = [
    { nome: 'São Paulo', estadoUf: 'SP' },
    { nome: 'Rio de Janeiro', estadoUf: 'RJ' },
    { nome: 'Belo Horizonte', estadoUf: 'MG' },
    { nome: 'Salvador', estadoUf: 'BA' },
    { nome: 'Curitiba', estadoUf: 'PR' },
    { nome: 'Porto Alegre', estadoUf: 'RS' },
    { nome: 'Recife', estadoUf: 'PE' },
    { nome: 'Fortaleza', estadoUf: 'CE' },
    { nome: 'Belém', estadoUf: 'PA' },
    { nome: 'Florianópolis', estadoUf: 'SC' },
  ];

  console.log('🏙️ Criando cidades...');
  for (const cidadeData of cidades) {
    const estado = await prisma.estado.findUnique({
      where: { uf: cidadeData.estadoUf },
    });
    
    if (estado) {
      // Verificar se a cidade já existe
      const cidadeExistente = await prisma.cidade.findFirst({
        where: {
          nome: cidadeData.nome,
          estadoId: estado.id,
        },
      });
      
      if (!cidadeExistente) {
        await prisma.cidade.create({
          data: {
            nome: cidadeData.nome,
            estadoId: estado.id,
          },
        });
      }
    }
  }

  // Criar usuários e profissionais
  const profissionais = [
    {
      nome: 'Dr. Carlos Silva',
      email: 'carlos.silva@email.com',
      telefone: '(11) 99999-1111',
      descricao: 'Advogado trabalhista com mais de 15 anos de experiência. Especialista em rescisões, férias, 13º salário e acidentes de trabalho.',
      categoria: 'Advogado',
      cidade: 'São Paulo',
      estadoUf: 'SP',
      mediaEstrelas: 4.9,
      totalAvaliacoes: 127,
    },
    {
      nome: 'Dra. Ana Costa',
      email: 'ana.costa@email.com',
      telefone: '(21) 99999-2222',
      descricao: 'Nutricionista clínica especializada em emagrecimento saudável, reeducação alimentar e nutrição esportiva.',
      categoria: 'Nutricionista',
      cidade: 'Rio de Janeiro',
      estadoUf: 'RJ',
      mediaEstrelas: 4.8,
      totalAvaliacoes: 89,
    },
    {
      nome: 'Pedro Santos',
      email: 'pedro.santos@email.com',
      telefone: '(31) 99999-3333',
      descricao: 'Desenvolvedor Full Stack especializado em React, Node.js, TypeScript e aplicações web modernas.',
      categoria: 'Desenvolvedor',
      cidade: 'Belo Horizonte',
      estadoUf: 'MG',
      mediaEstrelas: 4.7,
      totalAvaliacoes: 156,
    },
    {
      nome: 'Maria Oliveira',
      email: 'maria.oliveira@email.com',
      telefone: '(41) 99999-4444',
      descricao: 'Designer gráfica e UX/UI com foco em identidade visual, web design e experiência do usuário.',
      categoria: 'Designer',
      cidade: 'Curitiba',
      estadoUf: 'PR',
      mediaEstrelas: 4.6,
      totalAvaliacoes: 73,
    },
    {
      nome: 'João Mendes',
      email: 'joao.mendes@email.com',
      telefone: '(51) 99999-5555',
      descricao: 'Contador especializado em abertura de empresas, contabilidade fiscal e consultoria empresarial.',
      categoria: 'Contador',
      cidade: 'Porto Alegre',
      estadoUf: 'RS',
      mediaEstrelas: 4.5,
      totalAvaliacoes: 94,
    },
  ];

  console.log('👥 Criando profissionais...');
  for (const profData of profissionais) {
    // Criar usuário
    const senhaHash = crypto.createHash('sha256').update('123456').digest('hex');
    
    const usuario = await prisma.usuario.upsert({
      where: { email: profData.email },
      update: {},
      create: {
        nome: profData.nome,
        email: profData.email,
        senhaHash,
      },
    });

    // Buscar categoria e estado
    const categoria = await prisma.categoria.findUnique({
      where: { nome: profData.categoria },
    });

    const estado = await prisma.estado.findUnique({
      where: { uf: profData.estadoUf },
    });

    const cidade = await prisma.cidade.findFirst({
      where: {
        nome: profData.cidade,
        estadoId: estado?.id,
      },
    });

    // Criar profissional
    await prisma.profissional.upsert({
      where: { email: profData.email },
      update: {},
      create: {
        nome: profData.nome,
        email: profData.email,
        telefone: profData.telefone,
        descricao: profData.descricao,
        mediaEstrelas: profData.mediaEstrelas,
        totalAvaliacoes: profData.totalAvaliacoes,
        categoriaId: categoria?.id || '',
        estadoId: estado?.id,
        cidadeId: cidade?.id,
        usuarioId: usuario.id,
      },
    });
  }

  // Criar algumas avaliações de exemplo
  console.log('⭐ Criando avaliações...');
  const avaliacoes = [
    {
      estrelas: 5,
      comentario: 'Excelente profissional! Me ajudou muito com meu processo trabalhista. Recomendo!',
      autorEmail: 'maria.santos@email.com',
      profissionalEmail: 'carlos.silva@email.com',
    },
    {
      estrelas: 5,
      comentario: 'Perdi 12kg de forma saudável com a Dra. Ana. Muito profissional!',
      autorEmail: 'joao.oliveira@email.com',
      profissionalEmail: 'ana.costa@email.com',
    },
    {
      estrelas: 5,
      comentario: 'Pedro desenvolveu meu site e ficou incrível! Muito competente e pontual.',
      autorEmail: 'carla.mendes@email.com',
      profissionalEmail: 'pedro.santos@email.com',
    },
  ];

  for (const avalData of avaliacoes) {
    // Criar usuário autor da avaliação
    const senhaHash = crypto.createHash('sha256').update('123456').digest('hex');
    const autor = await prisma.usuario.upsert({
      where: { email: avalData.autorEmail },
      update: {},
      create: {
        nome: avalData.autorEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: avalData.autorEmail,
        senhaHash,
      },
    });

    const profissional = await prisma.profissional.findUnique({
      where: { email: avalData.profissionalEmail },
    });

    if (profissional) {
      await prisma.avaliacao.create({
        data: {
          estrelas: avalData.estrelas,
          comentario: avalData.comentario,
          autorId: autor.id,
          profissionalId: profissional.id,
        },
      });
    }
  }

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });