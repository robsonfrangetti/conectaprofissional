"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import LocationModal from "@/components/LocationModal";

export default function Home() {
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
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Encontre os profissionais que você precisa
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Conectamos você aos melhores profissionais de qualquer área
            </p>
            <Link 
              href="/buscar" 
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Buscar Profissionais
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Escolha o tipo de profissional que você procura
            </h3>
            <p className="text-gray-600">Encontre especialistas qualificados em diversas áreas</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categorias.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">Sem categorias disponíveis no momento.</p>
              </div>
            ) : (
              categorias.map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/buscar?categoria=${encodeURIComponent(categoria.id)}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300 group"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <span className="text-2xl">👨‍💼</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {categoria.nome}
                    </h4>
                    <p className="text-gray-600 text-sm mt-2">
                      Encontre profissionais especializados
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para encontrar seu profissional ideal?
          </h3>
          <p className="text-gray-600 mb-8">
            Clique em procurar para encontrar o profissional perfeito para suas necessidades
          </p>
          <Link 
            href="/buscar" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Procurar
          </Link>
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
                {categorias.slice(0, 4).map((categoria) => (
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
