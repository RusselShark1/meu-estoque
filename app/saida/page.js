'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Cadastro inicial local de backup em mm
const INSUMOS_INICIAIS = [
  { id: 'TS-01', nome: 'Tecido Tela Solar 1%', unidade: 'mm', qtd: 120000, min: 30000 },
  { id: 'TB-32', nome: 'Tubo 32 mm (Barra 6m)', unidade: 'mm', qtd: 60000, min: 18000 },
  { id: 'BI-01', nome: 'Barra Inferior (Barra 6m)', unidade: 'mm', qtd: 48000, min: 12000 },
  { id: 'CR-10', nome: 'Corrente Bola 10 (Rolo 250m)', unidade: 'mm', qtd: 250000, min: 50000 },
  { id: 'FT-01', nome: 'Fita da Base (Rolo 700m)', unidade: 'mm', qtd: 700000, min: 100000 },
  { id: 'DF-01', nome: 'Fita Dupla Face (Rolo 50m)', unidade: 'mm', qtd: 50000, min: 10000 },
  { id: 'KC-01', nome: 'Kit Comando (Catraca + Ponteira)', unidade: 'un', qtd: 25, min: 10 },
  { id: 'TP-01', nome: 'Tampa da Base (Par)', unidade: 'un', qtd: 30, min: 10 },
];

export default function SaidaProducaoMM() {
  const [estoque, setEstoque] = useState([]);
  
  // Entradas em milímetros (mm)
  const [numeroOP, setNumeroOP] = useState('');
  const [larguraMM, setLarguraMM] = useState('');
  const [alturaMM, setAlturaMM] = useState('');
  const [quantidade, setQuantidade] = useState('1');

  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  // Carregar dados da API Vercel Postgres ou LocalStorage
  useEffect(() => {
    async function carregarDados() {
      try {
        const res = await fetch('/api/estoque');
        if (res.ok) {
          const dados = await res.json();
          setEstoque(dados);
          return;
        }
      } catch (err) {
        console.log('Utilizando armazenamento local temporário.');
      }

      const dadosSalvos = localStorage.getItem('use_screen_estoque');
      if (dadosSalvos) {
        setEstoque(JSON.parse(dadosSalvos));
      } else {
        setEstoque(INSUMOS_INICIAIS);
        localStorage.setItem('use_screen_estoque', JSON.stringify(INSUMOS_INICIAIS));
      }
    }
    carregarDados();
  }, []);

  const largMM = parseInt(larguraMM) || 0;
  const altMM = parseInt(alturaMM) || 0;
  const qtd = parseInt(quantidade) || 1;

  // Consumos exatos calculados diretamente em milímetros (mm)
  const consumoTecidoMM = altMM * qtd;
  const consumoTuboMM = largMM * qtd;
  const consumoBarraInfMM = largMM * qtd;
  const consumoCorrenteMM = altMM * 2 * qtd;
  const consumoFitaBaseMM = largMM * qtd;
  const consumoDuplaFaceMM = largMM * qtd;
  const consumoKitComando = 1 * qtd;
  const consumoTampaBase = 1 * qtd;

  const handleBaixaOP = async (e) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    if (!numeroOP || largMM <= 0 || altMM <= 0) {
      setErroMsg('Informe o número da O.P. e as dimensões em milímetros (mm).');
      return;
    }

    const mapaConsumo = {
      'TS-01': consumoTecidoMM,
      'TB-32': consumoTuboMM,
      'BI-01': consumoBarraInfMM,
      'CR-10': consumoCorrenteMM,
      'FT-01': consumoFitaBaseMM,
      'DF-01': consumoDuplaFaceMM,
      'KC-01': consumoKitComando,
      'TP-01': consumoTampaBase,
    };

    // Verificar saldo
    for (let id in mapaConsumo) {
      const item = estoque.find(p => p.id === id);
      if (!item || item.qtd < mapaConsumo[id]) {
        setErroMsg(`Saldo insuficiente de "${item ? item.nome : id}". Necessário: ${mapaConsumo[id]} ${item ? item.unidade : 'mm'}, Disponível: ${item ? item.qtd : 0} ${item ? item.unidade : 'mm'}.`);
        return;
      }
    }

    // Atualização local
    const estoqueAtualizado = estoque.map(item => {
      if (mapaConsumo[item.id] !== undefined) {
        return { ...item, qtd: item.qtd - mapaConsumo[item.id] };
      }
      return item;
    });

    setEstoque(estoqueAtualizado);
    localStorage.setItem('use_screen_estoque', JSON.stringify(estoqueAtualizado));

    // Enviar baixa para a API Vercel Postgres
    try {
      await fetch('/api/estoque/saida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapaConsumo, numeroOP })
      });
    } catch (err) {
      console.log('Baixa salva localmente.');
    }

    setSucessoMsg(`O.P. ${numeroOP} (${largMM} mm × ${altMM} mm) baixada com sucesso no estoque!`);
    setNumeroOP('');
    setLarguraMM('');
    setAlturaMM('');
    setQuantidade('1');

    setTimeout(() => setSucessoMsg(''), 6000);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#333333] font-sans">
      
      {/* Cabeçalho */}
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
            <h1 className="text-lg font-bold text-[#333333] leading-tight">Ordem de Produção (Medidas em mm)</h1>
            <p className="text-xs text-gray-500 font-medium">Projeto Integrador II • Use Screen</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="bg-[#3A3B3C] text-white hover:bg-[#333333] px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            🔍 Consultar
          </Link>
          <Link 
            href="/cadastro" 
            className="bg-white text-[#333333] hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
          >
            📝 Cadastrar
          </Link>
        </div>
        
        <div className="md:ml-auto flex items-center gap-2 bg-[#25D366]/10 px-3.5 py-1.5 rounded-full text-[#25D366] text-xs font-bold w-fit">
          <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
          Modo Precisão (mm)
        </div>
      </header>

      {/* Form de O.P. */}
      <main className="max-w-4xl mx-auto p-6 md:p-12 space-y-6">
        
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

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#333333]">📐 Lançamento de Ordem de Produção</h2>
            <p className="text-xs text-gray-500">Insira a largura e altura da persiana em milímetros (ex: 1500 mm × 2000 mm).</p>
          </div>

          <form onSubmit={handleBaixaOP} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Nº O.P. / Pedido:</label>
                <input 
                  type="text"
                  placeholder="Ex: OP-2026-01"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={numeroOP}
                  onChange={(e) => setNumeroOP(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Largura (mm):</label>
                <input 
                  type="number"
                  placeholder="Ex: 1500"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#F2B78E]"
                  value={larguraMM}
                  onChange={(e) => setLarguraMM(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Altura (mm):</label>
                <input 
                  type="number"
                  placeholder="Ex: 2000"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#F2B78E]"
                  value={alturaMM}
                  onChange={(e) => setAlturaMM(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Qtd Peças:</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                />
              </div>
            </div>

            {/* Quadro Informativo de Abate em mm */}
            {largMM > 0 && altMM > 0 && (
              <div className="bg-[#F4F4F4]/80 p-6 rounded-2xl border border-gray-200 space-y-3">
                <h3 className="text-xs font-black text-gray-600 uppercase tracking-wider">
                  Desconto Físico no Estoque (em mm e unidades):
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium text-gray-700">
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Tecido Tela Solar</span>
                    <strong className="text-sm text-[#333333]">{consumoTecidoMM} mm</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Tubo 32mm</span>
                    <strong className="text-sm text-[#333333]">{consumoTuboMM} mm</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Barra Inferior</span>
                    <strong className="text-sm text-[#333333]">{consumoBarraInfMM} mm</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Corrente Bola 10</span>
                    <strong className="text-sm text-[#333333]">{consumoCorrenteMM} mm</strong>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#F2B78E] text-[#333333] hover:bg-[#ebae82] py-3.5 rounded-xl font-bold transition duration-200 text-sm shadow-sm shadow-[#F2B78E]/30"
            >
              Confirmar Baixa da O.P. em Milímetros
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}