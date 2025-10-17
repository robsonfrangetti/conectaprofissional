"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import LocationModal from "@/components/LocationModal";

export default function Home() {
  const { data: session } = useSession();
  const [categorias, setCategorias] = useState([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{estado: string, cidade: string} | null>(null);

  useEffect(() => {
    // Buscar categorias
    fetch('/api/categorias')
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error('Erro ao buscar categorias:', err));

    // Verificar se já tem localização salva
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      setUserLocation(JSON.parse(savedLocation));
    } else {
      // Abrir modal de localização após 2 segundos se não tiver localização salva
      setTimeout(() => {
        setIsLocationModalOpen(true);
      }, 2000);
    }
  }, []);

  const handleLocationSelect = (estado: string, cidade: string) => {
    const location = { estado, cidade };
    setUserLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  const handleOpenLocationModal = () => {
    setIsLocationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ConectaProfissional</h1>
            </div>
            <div className="flex items-center space-x-6">
              {/* Location Indicator */}
              <div className="flex items-center space-x-2">
                {userLocation ? (
                  <button
                    onClick={handleOpenLocationModal}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm">📍</span>
                    <span className="text-sm font-medium">
                      {userLocation.cidade}, {userLocation.estado}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleOpenLocationModal}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="text-sm">📍</span>
                    <span className="text-sm">Selecionar localização</span>
                  </button>
                )}
              </div>
                   <nav className="hidden md:flex space-x-8">
                     <Link href="/" className="text-gray-900 hover:text-blue-600">Início</Link>
                     <Link href="/buscar" className="text-gray-900 hover:text-blue-600">Profissionais</Link>
                     <Link href="/cadastro" className="text-gray-900 hover:text-blue-600">Cadastrar-se</Link>
                     <Link href="/contato" className="text-gray-900 hover:text-blue-600">Contato</Link>
                     {session ? (
                       <div className="flex items-center space-x-4">
                         {session.user.role === 'admin' && (
                           <Link href="/admin" className="text-gray-900 hover:text-blue-600">Admin</Link>
                         )}
                         <span className="text-gray-600">Olá, {session.user.name}</span>
                         <button 
                           onClick={() => signOut()}
                           className="text-gray-900 hover:text-blue-600"
                         >
                           Sair
                         </button>
                       </div>
                     ) : (
                       <Link href="/login" className="text-gray-900 hover:text-blue-600">Login</Link>
                     )}
                   </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-indigo-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400 rounded-full opacity-25 animate-pulse delay-2000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Encontre os <span className="text-yellow-400">melhores</span><br />
              profissionais do Brasil 🇧🇷
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Conectamos você aos especialistas mais qualificados em qualquer área, 
              com avaliações reais e preços transparentes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/buscar" 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                🔍 Buscar Profissionais
              </Link>
              <Link 
                href="/cadastro" 
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all duration-300"
              >
                👨‍💼 Sou Profissional
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Profissionais em Destaque */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Profissionais em <span className="text-blue-600">Destaque</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conheça alguns dos nossos melhores profissionais, avaliados por clientes reais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Profissional 1 */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl">
                    👨‍⚖️
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ 4.9
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Dr. Carlos Silva</h4>
                <p className="text-blue-600 font-semibold mb-3">Advogado Trabalhista</p>
                <p className="text-gray-600 text-sm mb-4">
                  Especialista em direito trabalhista com mais de 15 anos de experiência. 
                  Atende em todo território nacional.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">📍 São Paulo, SP</span>
                  <span className="text-sm text-gray-500">💰 A partir de R$ 200/h</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                  <span className="text-sm text-gray-600">(127 avaliações)</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 italic">
                    "Excelente profissional! Me ajudou muito com meu processo trabalhista. Recomendo!"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- Maria Santos</p>
                </div>
                <Link 
                  href="/profissional/carlos-silva"
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Ver Perfil Completo
                </Link>
              </div>
            </div>

            {/* Profissional 2 */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl">
                    🧑‍⚕️
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ 4.8
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Dra. Ana Costa</h4>
                <p className="text-green-600 font-semibold mb-3">Nutricionista</p>
                <p className="text-gray-600 text-sm mb-4">
                  Nutricionista clínica especializada em emagrecimento saudável e reeducação alimentar.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">📍 Rio de Janeiro, RJ</span>
                  <span className="text-sm text-gray-500">💰 A partir de R$ 150/h</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                  <span className="text-sm text-gray-600">(89 avaliações)</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 italic">
                    "Perdi 12kg de forma saudável com a Dra. Ana. Muito profissional!"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- João Oliveira</p>
                </div>
                <Link 
                  href="/profissional/ana-costa"
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Ver Perfil Completo
                </Link>
              </div>
            </div>

            {/* Profissional 3 */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl">
                    👨‍💻
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ 4.7
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">Pedro Santos</h4>
                <p className="text-purple-600 font-semibold mb-3">Desenvolvedor Full Stack</p>
                <p className="text-gray-600 text-sm mb-4">
                  Desenvolvedor especializado em React, Node.js e aplicações web modernas.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">📍 Belo Horizonte, MG</span>
                  <span className="text-sm text-gray-500">💰 A partir de R$ 80/h</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                  <span className="text-sm text-gray-600">(156 avaliações)</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700 italic">
                    "Pedro desenvolveu meu site e ficou incrível! Muito competente e pontual."
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- Carla Mendes</p>
                </div>
                <Link 
                  href="/profissional/pedro-santos"
                  className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Ver Perfil Completo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha o tipo de profissional que você procura
            </h3>
            <p className="text-xl text-gray-600">Encontre especialistas qualificados em diversas áreas</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categorias.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Sem categorias disponíveis no momento.</p>
              </div>
            ) : (
              categorias.map((categoria: any) => (
                <Link
                  key={categoria.id}
                  href={`/buscar?categoria=${encodeURIComponent(categoria.id)}`}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-300 group transform hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <span className="text-2xl text-white">👨‍💼</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {categoria.nome}
                    </h4>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4">
              Números que Impressionam
            </h3>
            <p className="text-xl text-blue-100">
              Milhares de profissionais e clientes já confiam em nós
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8">
              <div className="text-4xl font-bold text-yellow-400 mb-2">2.500+</div>
              <div className="text-lg">Profissionais Cadastrados</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8">
              <div className="text-4xl font-bold text-yellow-400 mb-2">15.000+</div>
              <div className="text-lg">Clientes Atendidos</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8">
              <div className="text-4xl font-bold text-yellow-400 mb-2">4.8</div>
              <div className="text-lg">Avaliação Média</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8">
              <div className="text-4xl font-bold text-yellow-400 mb-2">98%</div>
              <div className="text-lg">Satisfação dos Clientes</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Pronto para encontrar seu <span className="text-blue-600">profissional ideal</span>?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já encontraram o profissional perfeito 
            para suas necessidades. É rápido, fácil e gratuito!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/buscar" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              🔍 Buscar Profissionais
            </Link>
            <Link 
              href="/cadastro" 
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              👨‍💼 Cadastrar como Profissional
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">ConectaProfissional</h4>
              <p className="text-gray-400">
                Conectamos você aos melhores profissionais de qualquer área.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Links Úteis</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/buscar" className="hover:text-white">Buscar Profissionais</Link></li>
                <li><Link href="/cadastro" className="hover:text-white">Cadastrar-se</Link></li>
                <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Categorias</h5>
              <ul className="space-y-2 text-gray-400">
                     {categorias.slice(0, 4).map((categoria: any) => (
                  <li key={categoria.id}>
                    <Link href={`/buscar?categoria=${encodeURIComponent(categoria.id)}`} className="hover:text-white">
                      {categoria.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contato</h5>
              <p className="text-gray-400">
                Entre em contato conosco para mais informações.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ConectaProfissional. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}
