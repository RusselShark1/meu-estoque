'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EntradaInsumos() {
  const [estoque, setEstoque] = useState([]);
  const [itemSelecionado, setItemSelecionado] = useState('');
  const [qtdAdicionar, setQtdAdicionar] = useState('');
  const [documento, setDocumento] = useState('');

  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch('/api/estoque');
        if (res.ok) {
          const dados = await res.json();
          setEstoque(dados);
        }
      } catch (err) {
        console.error('Erro ao carregar insumos:', err);
      }
    }
    carregar();
  }, []);

  const itemAtual = estoque.find(i => i.id === itemSelecionado);

  const handleEntrada = async (e) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    if (!itemSelecionado || !qtdAdicionar || Number(qtdAdicionar) <= 0) {
      setErroMsg('Selecione um insumo e informe uma quantidade válida.');
      return;
    }

    setEnviando(true);

    try {
      const res = await fetch('/api/estoque/entrada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemSelecionado,
          quantidade: Number(qtdAdicionar),
          documento
        })
      });

      if (res.ok) {
        setSucessoMsg(`Entrada de ${qtdAdicionar} ${itemAtual?.unidade || 'mm'} realizada com sucesso para "${itemAtual?.nome}"!`);
        setItemSelecionado('');
        setQtdAdicionar('');
        setDocumento('');

        const resAtual = await fetch('/api/estoque');
        if (resAtual.ok) setEstoque(await resAtual.json());
      } else {
        setErroMsg('Erro ao registrar a entrada no banco de dados.');
      }
    } catch (err) {
      setErroMsg('Falha de conexão com o servidor.');
    } finally {
      setEnviando(false);
      setTimeout(() => setSucessoMsg(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#333333] font-sans">
      
      {/* Cabeçalho */}
      <header className="bg-white border-b border-gray-200 shadow-sm py-4 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
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
              <h1 className="text-base font-bold text-[#333333]">Entrada de Materiais</h1>
              <p className="text-xs text-gray-500">Projeto Integrador II • Use Screen • Grupo 22 - 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/" 
              className="bg-[#3A3B3C] text-white hover:bg-[#333333] px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              🔍 Consultar
            </Link>
            <Link 
              href="/saida" 
              className="bg-white text-[#333333] hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              ➖ Saída (O.P.)
            </Link>
          </div>
        </div>
      </header>

      {/* Form de Entrada */}
      <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
        
        {erroMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-bold shadow-sm">
            ⚠️ {erroMsg}
          </div>
        )}
        {sucessoMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm font-bold shadow-sm">
            ✅ {sucessoMsg}
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#333333]"> Recebimento de Itens no Almoxarifado</h2>
            <p className="text-xs text-gray-500">Acrescente saldo ao estoque físico informando a quantidade em milímetros ou unidades.</p>
          </div>

          <form onSubmit={handleEntrada} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Selecione o Item:</label>
                <select 
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={itemSelecionado}
                  onChange={(e) => setItemSelecionado(e.target.value)}
                >
                  <option value="">-- Escolha o item --</option>
                  {estoque.map(item => (
                    <option key={item.id} value={item.id}>
                      [{item.id}] {item.nome} — Saldo: {item.qtd} {item.unidade || 'mm'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Nº Nota Fiscal / Doc. (Opcional):</label>
                <input 
                  type="text"
                  placeholder="Ex: NF-10452"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={documento}
                  onChange={(e) => setDocumento(e.target.value)}
                />
              </div>
            </div>

            {itemAtual && (
              <div className="bg-[#F2B78E]/15 border border-[#F2B78E]/40 p-4 rounded-xl flex items-center justify-between text-xs font-bold text-[#333333]">
                <span>Insumo: <strong>{itemAtual.nome}</strong></span>
                <span>Saldo Atual: <strong className="bg-white px-2 py-0.5 rounded shadow-xs">{itemAtual.qtd} {itemAtual.unidade || 'mm'}</strong></span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">
                Quantidade a Adicionar {itemAtual ? `(${itemAtual.unidade || 'mm'})` : '(mm ou un)'}:
              </label>
              <input 
                type="number"
                placeholder={itemAtual?.unidade === 'un' ? 'Ex: 50' : 'Ex: 6000 (para 6m de barra)'}
                className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E] font-bold"
                value={qtdAdicionar}
                onChange={(e) => setQtdAdicionar(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={enviando}
              className="w-full bg-[#F2B78E] text-[#333333] hover:bg-[#ebae82] py-3.5 rounded-xl font-bold transition text-sm shadow-sm disabled:opacity-50"
            >
              {enviando ? 'Registrando...' : '➕ Confirmar Entrada no Estoque'}
            </button>

          </form>
        </div>

      </main>
    </div>
  );
}