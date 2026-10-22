'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CadastroInsumos() {
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Componentes');
  const [unidade, setUnidade] = useState('mm');
  const [qtdInicial, setQtdInicial] = useState('');
  const [estoqueMin, setEstoqueMin] = useState('');

  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    if (!codigo.trim() || !nome.trim() || !qtdInicial || !estoqueMin) {
      setErroMsg('Por favor, preencha todos os campos.');
      return;
    }

    setEnviando(true);

    try {
      const res = await fetch('/api/estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: codigo.trim().toUpperCase(),
          nome: nome.trim(),
          categoria,
          qtd: Number(qtdInicial),
          min: Number(estoqueMin),
          unidade
        })
      });

      if (res.ok) {
        setSucessoMsg(`Insumo "${nome}" (${codigo.toUpperCase()}) cadastrado com sucesso!`);
        setCodigo('');
        setNome('');
        setCategoria('Componentes');
        setUnidade('mm');
        setQtdInicial('');
        setEstoqueMin('');
      } else {
        setErroMsg('Erro ao salvar o insumo no banco de dados. Verifique se o código já existe.');
      }
    } catch (err) {
      setErroMsg('Falha de conexão ao cadastrar o insumo.');
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
              <h1 className="text-base font-bold text-[#333333]">Cadastrar Novo Insumo</h1>
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
          </div>
        </div>
      </header>

      {/* Form de Cadastro */}
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
            <h2 className="text-lg font-bold text-[#333333]">📝 Inclusão de Novo Material no Catálogo</h2>
            <p className="text-xs text-gray-500">Cadastre um novo item informando as dimensões padrão e estoque mínimo de segurança.</p>
          </div>

          <form onSubmit={handleCadastrar} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Código do Insumo:</label>
                <input 
                  type="text"
                  placeholder="Ex: TS-02"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono font-bold focus:outline-none focus:border-[#F2B78E]"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Categoria:</label>
                <select 
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="Tecidos">Tecidos</option>
                  <option value="Componentes">Componentes</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="Motores">Motores</option>
                  <option value="Opcionais">Opcionais</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Unidade de Medida:</label>
                <select 
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={unidade}
                  onChange={(e) => setUnidade(e.target.value)}
                >
                  <option value="mm">Milímetros (mm)</option>
                  <option value="un">Unidades (un)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Nome do Insumo:</label>
              <input 
                type="text"
                placeholder="Ex: Tecido Screen 5% Bege"
                className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Quantidade Inicial ({unidade}):
                </label>
                <input 
                  type="number"
                  placeholder={unidade === 'mm' ? 'Ex: 30000 (30m)' : 'Ex: 20'}
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={qtdInicial}
                  onChange={(e) => setQtdInicial(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Estoque Mínimo ({unidade}):
                </label>
                <input 
                  type="number"
                  placeholder={unidade === 'mm' ? 'Ex: 10000 (10m)' : 'Ex: 5'}
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={estoqueMin}
                  onChange={(e) => setEstoqueMin(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={enviando}
              className="w-full bg-[#F2B78E] text-[#333333] hover:bg-[#ebae82] py-3.5 rounded-xl font-bold transition text-sm shadow-sm disabled:opacity-50"
            >
              {enviando ? 'Salvando...' : '➕ Salvar e Cadastrar Insumo'}
            </button>

          </form>
        </div>

      </main>
    </div>
  );
}