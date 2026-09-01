'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Importante para navegar sem recarregar a página!

// Banco de dados simulado inicial de persianas e insumos da Use Screen
const ESTOQUE_INICIAL = [
  { id: 'AL-01', nome: 'Perfil de Alumínio Trilho Superior', categoria: 'Componentes', qtd: 45, min: 20 },
  { id: 'TS-05', nome: 'Tecido Screen 3% Cinza (Rolo 2.5m)', categoria: 'Tecidos', qtd: 8, min: 10 },
  { id: 'MT-45', nome: 'Motor Tubular Bivolt 45mm', categoria: 'Motores', qtd: 4, min: 8 },
  { id: 'SP-10', nome: 'Suporte de Fixação Lateral', categoria: 'Componentes', qtd: 150, min: 50 },
  { id: 'CR-02', nome: 'Controle Remoto 5 Canais', categoria: 'Acessórios', qtd: 15, min: 15 },
];

export default function Home() {
  const [pesquisa, setPesquisa] = useState('');
  const [estoque, setEstoque] = useState([]); // Começa vazio e carrega do localStorage

  // Carregar os dados salvos no localStorage ao abrir a tela de consulta
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('use_screen_estoque');
    if (dadosSalvos) {
      setEstoque(JSON.parse(dadosSalvos));
    } else {
      setEstoque(ESTOQUE_INICIAL);
      localStorage.setItem('use_screen_estoque', JSON.stringify(ESTOQUE_INICIAL));
    }
  }, []);

  // Filtrar itens críticos (quantidade atual menor que o estoque mínimo)
  const itensCriticos = estoque.filter(item => item.qtd < item.min);

  // Filtrar itens por busca em tempo real (código ou nome)
  const itensFiltrados = estoque.filter(item =>
    item.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    item.id.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#333333] font-sans">
      
      {/* Barra de Navegação/Cabeçalho com as cores da Use Screen */}
      <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6 md:px-12 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="flex items-center gap-4">
          {/* LOGOTIPO REAL DO SITE (Lido diretamente da pasta public/) */}
          <div className="h-12 w-auto flex items-center">
            <img 
              src="/logotipo.png" 
              alt="Logotipo Use Screen" 
              className="h-full object-contain max-h-12"
              onError={(e) => {
                e.target.style.display = 'none';
                document.getElementById('fallback-logo').style.display = 'flex';
              }}
            />
            {/* Logo de segurança (Fallback) caso a imagem não exista na pasta public */}
            <div 
              id="fallback-logo" 
              className="hidden w-10 h-10 rounded-xl bg-[#3A3B3C] items-center justify-center text-[#F2B78E] font-extrabold text-lg shadow-sm"
            >
              US
            </div>
          </div>
          
          <div className="border-l border-gray-200 pl-4">
            <h1 className="text-lg font-bold text-[#333333] leading-tight">Controle de Estoque</h1>
            <p className="text-xs text-gray-500 font-medium">Projeto Integrador II • Use Screen</p>
          </div>
        </div>
        
        {/* Botão de Adicionar Itens - Alinhado à esquerda logo após as informações da marca */}
        <div className="flex items-center">
          <Link 
            href="/entrada" 
            className="bg-[#F2B78E] text-[#333333] hover:bg-[#ebae82] px-4 py-2.5 rounded-xl text-sm font-bold transition duration-200 shadow-sm shadow-[#F2B78E]/20 flex items-center gap-1.5"
          >
            ➕ Adicionar Itens
          </Link>
        </div>
        
        {/* Status de Conexão - Empurrado automaticamente para o canto direito em telas grandes (md:ml-auto) */}
        <div className="md:ml-auto flex items-center gap-2 bg-[#25D366]/10 px-3.5 py-1.5 rounded-full text-[#25D366] text-xs font-bold w-fit">
          <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
          Sistema Ativo 
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-8">
        
        {/* Central de Atenção: Painel de Alertas Rápidos */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total de Itens Cadastrados</h2>
            <p className="text-4xl font-black text-[#333333]">{estoque.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-red-500">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Itens em Alerta Crítico (Repor)</h2>
            <p className="text-4xl font-black text-red-500">{itensCriticos.length}</p>
          </div>
        </section>

        {/* Barra de Busca Inteligente com foco na cor Pêssego (#F2B78E) */}
        <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#333333]">🔍 Consulta Rápida de Produtos</h2>
          <input
            type="text"
            placeholder="Buscar por código (ex: TS-05) ou nome do item..."
            className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3.5 text-[#333333] placeholder-gray-400 focus:outline-none focus:border-[#F2B78E] focus:ring-2 focus:ring-[#F2B78E]/30 transition duration-200"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </section>

        {/* Tabela de Insumos */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-white">
            <h3 className="font-bold text-lg text-[#333333]">Inventário de Insumos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4F4F4] text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Código</th>
                  <th className="py-3.5 px-6">Nome do Insumo</th>
                  <th className="py-3.5 px-6">Categoria</th>
                  <th className="py-3.5 px-6 text-center">Qtd Atual</th>
                  <th className="py-3.5 px-6 text-center">Estoque Mín.</th>
                  <th className="py-3.5 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {itensFiltrados.map((item) => {
                  const isCritico = item.qtd < item.min;
                  return (
                    <tr key={item.id} className="hover:bg-[#F4F4F4]/30 transition duration-150">
                      <td className="py-4 px-6 font-mono font-bold text-xs text-[#3A3B3C]">{item.id}</td>
                      <td className="py-4 px-6 font-semibold text-[#333333] text-sm">{item.nome}</td>
                      <td className="py-4 px-6">
                        <span className="bg-[#F4F4F4] text-[#3A3B3C] px-3 py-1 rounded-full text-xs font-semibold">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-sm">{item.qtd}</td>
                      <td className="py-4 px-6 text-center text-gray-500 text-sm">{item.min}</td>
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {isCritico ? (
                          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100 whitespace-nowrap">
                            Abaixo do Mínimo
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 whitespace-nowrap">
                            Saudável
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {itensFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-12 px-6 text-center text-gray-400 font-medium text-sm">
                      Nenhum insumo correspondente encontrado para "{pesquisa}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}