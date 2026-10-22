'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [pesquisa, setPesquisa] = useState('');
  const [estoque, setEstoque] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarEstoque = async () => {
    try {
      setCarregando(true);
      const res = await fetch('/api/estoque');
      if (res.ok) {
        const dados = await res.json();
        setEstoque(dados);
      }
    } catch (err) {
      console.error('Erro ao carregar os dados do estoque:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarEstoque();
  }, []);

  const itensCriticos = estoque.filter(item => Number(item.qtd) < Number(item.min));
  const itensFiltrados = estoque.filter(item =>
    item.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    item.id.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#333333] font-sans">
      
      {/* Cabeçalho */}
      <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <img 
              src="/logotipo.png" 
              alt="Use Screen" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                document.getElementById('fallback-logo').style.display = 'flex';
              }}
            />
            <div id="fallback-logo" className="hidden w-10 h-10 rounded-xl bg-[#3A3B3C] items-center justify-center text-[#F2B78E] font-bold text-base">
              US
            </div>
            
            <div className="border-l border-gray-200 pl-4">
              <h1 className="text-base font-bold text-[#333333]">Controle de Estoque</h1>
              <p className="text-xs text-gray-500">Projeto Integrador II • Use Screen</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link 
              href="/entrada" 
              className="bg-[#F2B78E] text-[#333333] hover:bg-[#ebae82] px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              ➕ Entrada
            </Link>

            <Link 
              href="/saida" 
              className="bg-[#3A3B3C] text-white hover:bg-[#333333] px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              ➖ Saída (O.P.)
            </Link>

            <Link 
              href="/cadastro" 
              className="bg-white text-[#333333] hover:bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              📝 Cadastrar
            </Link>

            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistema Conectado
            </span>
          </div>

        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-6">
        
        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total de Insumos</p>
              <p className="text-3xl font-black text-[#333333] mt-1">{carregando ? '...' : estoque.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">📦</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm border-l-4 border-l-red-500 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Itens Críticos (Repor)</p>
              <p className="text-3xl font-black text-red-500 mt-1">{carregando ? '...' : itensCriticos.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-xl">⚠️</div>
          </div>
        </div>

        {/* Busca */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <input
            type="text"
            placeholder="🔍 Digite o código (ex: TS-01) ou nome do material..."
            className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm text-[#333333] focus:outline-none focus:border-[#F2B78E]"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
        </div>

        {/* Tabela de Inventário */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-sm text-[#333333]">Inventário Físico do Almoxarifado</h2>
            <button 
              onClick={carregarEstoque} 
              className="text-xs font-semibold text-gray-500 hover:text-[#333333] transition"
            >
              🔄 Atualizar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#F4F4F4] text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Código</th>
                  <th className="py-3 px-6">Insumo / Material</th>
                  <th className="py-3 px-6">Categoria</th>
                  <th className="py-3 px-6 text-center">Saldo Atual</th>
                  <th className="py-3 px-6 text-center">Estoque Mín.</th>
                  <th className="py-3 px-6 text-right">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {carregando ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400 text-sm">
                      Carregando dados do estoque...
                    </td>
                  </tr>
                ) : itensFiltrados.map((item) => {
                  const isCritico = Number(item.qtd) < Number(item.min);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-6 font-mono font-bold text-xs text-[#3A3B3C]">{item.id}</td>
                      <td className="py-3.5 px-6 font-semibold text-[#333333]">{item.nome}</td>
                      <td className="py-3.5 px-6">
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md text-xs font-medium">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-center font-bold">
                        {item.qtd} <span className="text-xs font-normal text-gray-400">{item.unidade || 'mm'}</span>
                      </td>
                      <td className="py-3.5 px-6 text-center text-gray-500">
                        {item.min} <span className="text-xs text-gray-400">{item.unidade || 'mm'}</span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        {isCritico ? (
                          <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-md text-xs font-bold border border-red-100">
                            Abaixo do Mínimo
                          </span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}