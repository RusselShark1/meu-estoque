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

export default function EntradaInsumos() {
  const [estoque, setEstoque] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState('');
  const [quantidadeEntrada, setQuantidadeEntrada] = useState('');
  const [sucessoMsg, setSucessoMsg] = useState('');

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

  // Função para salvar a entrada de material
  const handleSalvarEntrada = (e) => {
    e.preventDefault();

    if (!itemSelecionado || !quantidadeEntrada || Number(quantidadeEntrada) <= 0) {
      alert('Por favor, selecione um item e digite uma quantidade válida.');
      return;
    }

    // Atualizar a quantidade somando a nova entrada
    const estoqueAtualizado = estoque.map(item => {
      if (item.id === itemSelecionado) {
        return { ...item, qtd: item.qtd + Number(quantidadeEntrada) };
      }
      return item;
    });

    // Salvar no estado e gravar no "banco" localStorage
    setEstoque(estoqueAtualizado);
    localStorage.setItem('use_screen_estoque', JSON.stringify(estoqueAtualizado));

    // Exibir mensagem de sucesso amigável
    const produtoNome = estoque.find(p => p.id === itemSelecionado)?.nome;
    setSucessoMsg(`Sucesso! Foram adicionadas ${quantidadeEntrada} unidades ao item: ${produtoNome}.`);
    
    // Limpar o formulário
    setItemSelecionado('');
    setQuantidadeEntrada('');

    // Sumir com a mensagem de sucesso depois de 4 segundos
    setTimeout(() => setSucessoMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#333333] font-sans">
      
    
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
        
        {/* Botão de Lançar Entrada - Posicionado logo após as informações da marca */}
          {/* Botão de Voltar para a Tela de Consulta */}
        <Link 
          href="/" 
          className="bg-[#3A3B3C] text-white hover:bg-[#333333] px-4 py-2 rounded-xl text-sm font-bold transition duration-200 flex items-center gap-1.5"
        >
          🔍 Consultar Estoque
        </Link>
        
        {/* Status de Conexão - Empurrado automaticamente para o canto direito em telas grandes (md:ml-auto) */}
        <div className="md:ml-auto flex items-center gap-2 bg-[#25D366]/10 px-3.5 py-1.5 rounded-full text-[#25D366] text-xs font-bold w-fit">
          <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
          Sistema Ativo 
        </div>
      </header>
      

      {/* Conteúdo do Formulário */}
      <main className="max-w-3xl mx-auto p-6 md:p-12">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-[#333333] border-b border-gray-100 pb-4">
            📥 Registrar Entrada no Estoque
          </h2>

          {sucessoMsg && (
            <div className="bg-[#25D366]/10 border border-[#25D366]/30 text-emerald-700 p-4 rounded-xl text-sm font-semibold animate-bounce">
              {sucessoMsg}
            </div>
          )}

          <form onSubmit={handleSalvarEntrada} className="space-y-6">
            {/* Campo 1: Selecionar Produto */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-600">Selecione o Insumo:</label>
              <select 
                className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-[#333333] focus:outline-none focus:border-[#F2B78E]"
                value={itemSelecionado}
                onChange={(e) => setItemSelecionado(e.target.value)}
              >
                <option value="">-- Clique para escolher um produto --</option>
                {estoque.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.id} - {item.nome} (Qtd Atual: {item.qtd})
                  </option>
                ))}
              </select>
            </div>

            {/* Campo 2: Quantidade de Entrada */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-gray-600">Quantidade a Adicionar:</label>
              <input 
                type="number" 
                placeholder="Ex: 20"
                className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-[#333333] placeholder-gray-400 focus:outline-none focus:border-[#F2B78E]"
                value={quantidadeEntrada}
                onChange={(e) => setQuantidadeEntrada(e.target.value)}
              />
            </div>

            {/* Botão de Enviar com a cor Pêssego (#F2B78E) */}
            <button 
              type="submit"
              className="w-full bg-[#F2B78E] text-[#333333] hover:bg-[#ebae82] py-3.5 rounded-xl font-bold transition duration-200 shadow-sm shadow-[#F2B78E]/40 text-sm"
            >
              📥 Confirmar Entrada no Estoque
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}