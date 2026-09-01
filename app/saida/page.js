'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Lista padrão caso o localStorage esteja vazio
const ESTOQUE_INICIAL = [
  { id: 'AL-01', nome: 'Perfil de Alumínio Trilho Superior', categoria: 'Componentes', qtd: 45, min: 20 },
  { id: 'TS-05', nome: 'Tecido Screen 3% Cinza (Rolo 2.5m)', categoria: 'Tecidos', qtd: 8, min: 10 },
  { id: 'MT-45', nome: 'Motor Tubular Bivolt 45mm', categoria: 'Motores', qtd: 4, min: 8 },
  { id: 'SP-10', nome: 'Suporte de Fixação Lateral', categoria: 'Componentes', qtd: 150, min: 50 },
  { id: 'CR-02', nome: 'Controle Remoto 5 Canais', categoria: 'Acessórios', qtd: 15, min: 15 },
];

export default function SaidaInsumos() {
  const [estoque, setEstoque] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState('');
  const [quantidadeSaida, setQuantidadeSaida] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  // Carregar o estoque do localStorage ao abrir a tela
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('use_screen_estoque');
    if (dadosSalvos) {
      setEstoque(JSON.parse(dadosSalvos));
    } else {
      setEstoque(ESTOQUE_INICIAL);
      localStorage.setItem('use_screen_estoque', JSON.stringify(ESTOQUE_INICIAL));
    }
  }, []);

  // Função para processar a baixa de material
  const handleSalvarSaida = (e) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    if (!itemSelecionado || !quantidadeSaida || Number(quantidadeSaida) <= 0) {
      setErroMsg('Por favor, selecione um item e digite uma quantidade de saída válida.');
      return;
    }

    const itemEstoque = estoque.find(p => p.id === itemSelecionado);
    if (!itemEstoque) return;

    // Regra de Negócio: Impedir saída maior do que o saldo em estoque
    if (itemEstoque.qtd < Number(quantidadeSaida)) {
      setErroMsg(`Quantidade indisponível! O estoque atual de "${itemEstoque.nome}" é de apenas ${itemEstoque.qtd} unidades.`);
      return;
    }

    // Deduzir a quantidade correspondente
    const estoqueAtualizado = estoque.map(item => {
      if (item.id === itemSelecionado) {
        return { ...item, qtd: item.qtd - Number(quantidadeSaida) };
      }
      return item;
    });

    // Atualizar o estado local e salvar no localStorage
    setEstoque(estoqueAtualizado);
    localStorage.setItem('use_screen_estoque', JSON.stringify(estoqueAtualizado));

    setSucessoMsg(`Sucesso! Foram retiradas ${quantidadeSaida} unidades de "${itemEstoque.nome}".`);
    setItemSelecionado('');
    setQuantidadeSaida('');

    // Limpar mensagem de sucesso após 4 segundos
    setTimeout(() => setSucessoMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#333333] font-sans">
      
      {/* Cabeçalho Consistente (Projeto Integrador II • Use Screen) */}
      <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6 md:px-12 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="flex items-center gap-4">
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
            <div id="fallback-logo" className="hidden w-10 h-10 rounded-xl bg-[#3A3B3C] items-center justify-center text-[#F2B78E] font-extrabold text-lg">
              US
            </div>
          </div>
          
          <div className="border-l border-gray-200 pl-4">
            <h1 className="text-lg font-bold text-[#333333] leading-tight">Registrar Baixa</h1>
            <p className="text-xs text-gray-500 font-medium">Projeto Integrador II • Use Screen</p>
          </div>
        </div>
        
        {/* Botão de navegação para voltar à Tela 1 */}
        <div className="flex items-center">
          <Link 
            href="/" 
            className="bg-[#3A3B3C] text-white hover:bg-[#333333] px-4 py-2.5 rounded-xl text-sm font-bold transition duration-200 flex items-center gap-1.5 shadow-sm"
          >
            🔍 Consultar Estoque
          </Link>
        </div>
        
        {/* Status do Sistema */}
        <div className="md:ml-auto flex items-center gap-2 bg-[#25D366]/10 px-3.5 py-1.5 rounded-full text-[#25D366] text-xs font-bold w-fit">
          <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
          Sistema Ativo (Vercel)
        </div>
      </header>

      {/* Formulário de Saída */}
      <main className="max-w-3xl mx-auto p-6 md:p-12">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-[#333333] border-b border-gray-100 pb-4">
            📤 Registrar Saída / Consumo da Produção
          </h2>

          {/* Alerta de Estoque Insuficiente */}
          {erroMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-bold">
              ⚠️ {erroMsg}
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {sucessoMsg && (
            <div className="bg-[#25D366]/10 border border-[#25D366]/30 text-emerald-700 p-4 rounded-xl text-sm font-semibold">
              ✅ {sucessoMsg}
            </div>
          )}

          <form onSubmit={handleSalvarSaida} className="space-y-6">
            {/* Selecionar Insumo */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-600">Selecione o Insumo para Baixa:</label>
              <select 
                className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-[#333333] focus:outline-none focus:border-[#F2B78E]"
                value={itemSelecionado}
                onChange={(e) => setItemSelecionado(e.target.value)}
              >
                <option value="">-- Clique para escolher um produto --</option>
                {estoque.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.id} - {item.nome} (Disponível: {item.qtd})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantidade */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-600">Quantidade a Retirar:</label>
              <input 
                type="number" 
                placeholder="Ex: 5"
                className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-[#333333] placeholder-gray-400 focus:outline-none focus:border-[#F2B78E]"
                value={quantidadeSaida}
                onChange={(e) => setQuantidadeSaida(e.target.value)}
              />
            </div>

            {/* Botão de Enviar em Cinza Chumbo Escuro (#3A3B3C) */}
            <button 
              type="submit"
              className="w-full bg-[#3A3B3C] text-white hover:bg-[#333333] py-3.5 rounded-xl font-bold transition duration-200 shadow-sm text-sm"
            >
              📤 Confirmar Baixa de Insumos
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}