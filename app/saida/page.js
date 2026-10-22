'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Cadastro de Insumos com preçagem real e conversão de atacado para fracionado
const INSUMOS_INICIAIS = [
  { id: 'TS-01', nome: 'Tecido Tela Solar 1%', unidade: 'm linear', qtd: 120, min: 30, precoUn: 118.75 },
  { id: 'TB-32', nome: 'Tubo 32 mm (Barra 6m)', unidade: 'm', qtd: 60, min: 18, precoUn: 11.67 }, // R\$ 70,00 / 6m
  { id: 'BI-01', nome: 'Barra Inferior (Barra 6m)', unidade: 'm', qtd: 48, min: 12, precoUn: 11.50 }, // R\$ 69,00 / 6m
  { id: 'CR-10', nome: 'Corrente Bola 10 (Rolo 250m)', unidade: 'm', qtd: 250, min: 50, precoUn: 0.74 }, // R\$ 185,00 / 250m
  { id: 'FT-01', nome: 'Fita da Base (Rolo 700m)', unidade: 'm', qtd: 700, min: 100, precoUn: 0.28 }, // R\$ 195,00 / 700m
  { id: 'DF-01', nome: 'Fita Dupla Face (Rolo 50m)', unidade: 'm', qtd: 50, min: 10, precoUn: 1.00 }, // R\$ 50,00 / 50m
  { id: 'KC-01', nome: 'Kit Comando (Catraca + Ponteira)', unidade: 'un', qtd: 25, min: 10, precoUn: 9.90 },
  { id: 'TP-01', nome: 'Tampa da Base (Par)', unidade: 'un', qtd: 30, min: 10, precoUn: 0.90 },
];

export default function SaidaProducao() {
  const [estoque, setEstoque] = useState([]);
  
  // Dados da O.P.
  const [numeroOP, setNumeroOP] = useState('');
  const [largura, setLargura] = useState('');
  const [altura, setAltura] = useState('');
  const [quantidade, setQuantidade] = useState('1');

  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('use_screen_estoque');
    if (dadosSalvos) {
      setEstoque(JSON.parse(dadosSalvos));
    } else {
      setEstoque(INSUMOS_INICIAIS);
      localStorage.setItem('use_screen_estoque', JSON.stringify(INSUMOS_INICIAIS));
    }
  }, []);

  // Conversões e Cálculos de Consumo
  const larg = parseFloat(largura) || 0;
  const alt = parseFloat(altura) || 0;
  const qtd = parseInt(quantidade) || 1;

  // Quantidades fracionadas consumidas por unidade de persiana
  const consumoTecido = (alt * qtd).toFixed(2);
  const consumoTubo = (larg * qtd).toFixed(2);
  const consumoBarraInf = (larg * qtd).toFixed(2);
  const consumoCorrente = (alt * 2 * qtd).toFixed(2);
  const consumoFitaBase = (larg * qtd).toFixed(2);
  const consumoDuplaFace = (larg * qtd).toFixed(2);
  const consumoKitComando = 1 * qtd;
  const consumoTampaBase = 1 * qtd;

  // Cálculo do Custo Industrial Total da O.P.
  const custoTotalOP = (
    (consumoTecido * 118.75) +
    (consumoTubo * 11.67) +
    (consumoBarraInf * 11.50) +
    (consumoCorrente * 0.74) +
    (consumoFitaBase * 0.28) +
    (consumoDuplaFace * 1.00) +
    (consumoKitComando * 9.90) +
    (consumoTampaBase * 0.90)
  ).toFixed(2);

  // Processar Baixa no Estoque
  const handleBaixaOP = (e) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    if (!numeroOP || larg <= 0 || alt <= 0) {
      setErroMsg('Por favor, preencha o número da O.P. e as dimensões válidas (Largura e Altura).');
      return;
    }

    // Mapa de consumo por ID de insumo
    const mapaConsumo = {
      'TS-01': parseFloat(consumoTecido),
      'TB-32': parseFloat(consumoTubo),
      'BI-01': parseFloat(consumoBarraInf),
      'CR-10': parseFloat(consumoCorrente),
      'FT-01': parseFloat(consumoFitaBase),
      'DF-01': parseFloat(consumoDuplaFace),
      'KC-01': consumoKitComando,
      'TP-01': consumoTampaBase,
    };

    // Validar se há saldo suficiente de todos os itens
    for (let id in mapaConsumo) {
      const item = estoque.find(p => p.id === id);
      if (!item || item.qtd < mapaConsumo[id]) {
        setErroMsg(`Saldo insuficiente de "${item ? item.nome : id}". Necessário: ${mapaConsumo[id]}, Disponível: ${item ? item.qtd : 0}.`);
        return;
      }
    }

    // Abater do estoque
    const estoqueAtualizado = estoque.map(item => {
      if (mapaConsumo[item.id] !== undefined) {
        return { ...item, qtd: parseFloat((item.qtd - mapaConsumo[item.id]).toFixed(2)) };
      }
      return item;
    });

    setEstoque(estoqueAtualizado);
    localStorage.setItem('use_screen_estoque', JSON.stringify(estoqueAtualizado));

    setSucessoMsg(`O.P. ${numeroOP} Baixada com Sucesso! Custo de Produção Calculado: R$ ${custoTotalOP.replace('.', ',')}.`);
    setNumeroOP('');
    setLargura('');
    setAltura('');
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
            <h1 className="text-lg font-bold text-[#333333] leading-tight">Ordem de Produção (Saída)</h1>
            <p className="text-xs text-gray-500 font-medium">Projeto Integrador II • Use Screen</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Link 
            href="/" 
            className="bg-[#3A3B3C] text-white hover:bg-[#333333] px-4 py-2.5 rounded-xl text-sm font-bold transition duration-200 flex items-center gap-1.5 shadow-sm"
          >
            🔍 Consultar Estoque
          </Link>
        </div>
        
        <div className="md:ml-auto flex items-center gap-2 bg-[#25D366]/10 px-3.5 py-1.5 rounded-full text-[#25D366] text-xs font-bold w-fit">
          <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
          Sistema Ativo (Vercel)
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto p-6 md:p-12 space-y-6">
        
        {/* Alertas */}
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
            <h2 className="text-lg font-bold text-[#333333]">Lançamento de O.P. e Calculadora de Insumos</h2>
            <p className="text-xs text-gray-500">Digite as dimensões da persiana Rolo Tela Solar 1% para calcular a baixa fracionada de cada material.</p>
          </div>

          <form onSubmit={handleBaixaOP} className="space-y-6">
            
            {/* Entradas da O.P. */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Nº O.P. / Pedido:</label>
                <input 
                  type="text"
                  placeholder="Ex: OP-2026-10"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={numeroOP}
                  onChange={(e) => setNumeroOP(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Largura (m):</label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder="Ex: 1.50"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={largura}
                  onChange={(e) => setLargura(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Altura (m):</label>
                <input 
                  type="number"
                  step="0.01"
                  placeholder="Ex: 2.00"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
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

            {/* Painel de Cálculo Automático e Custo */}
            {larg > 0 && alt > 0 && (
              <div className="bg-[#F4F4F4]/70 p-6 rounded-2xl border border-gray-200 space-y-4 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 pb-3 gap-2">
                  <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                    Resumo do Consumo Fracionado da O.P.:
                  </h3>
                  <div className="text-sm font-extrabold text-[#333333] bg-[#F2B78E]/30 px-3 py-1 rounded-lg">
                    Custo Total dos Insumos: R\$ {custoTotalOP.replace('.', ',')}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium text-gray-700">
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Tecido Tela Solar 1%</span>
                    <strong className="text-sm text-[#333333]">{consumoTecido} m</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Tubo 32mm</span>
                    <strong className="text-sm text-[#333333]">{consumoTubo} m</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Barra Inferior</span>
                    <strong className="text-sm text-[#333333]">{consumoBarraInf} m</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Corrente Bola 10</span>
                    <strong className="text-sm text-[#333333]">{consumoCorrente} m</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Fita da Base</span>
                    <strong className="text-sm text-[#333333]">{consumoFitaBase} m</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Fita Dupla Face</span>
                    <strong className="text-sm text-[#333333]">{consumoDuplaFace} m</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Kit Comando</span>
                    <strong className="text-sm text-[#333333]">{consumoKitComando} un</strong>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px] uppercase">Tampa da Base</span>
                    <strong className="text-sm text-[#333333]">{consumoTampaBase} par</strong>
                  </div>
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#F2B78E] text-[#333333] hover:bg-[#ebae82] py-3.5 rounded-xl font-bold transition duration-200 text-sm shadow-sm shadow-[#F2B78E]/30"
            >
              🏭 Confirmar Baixa da O.P. e Abater Insumos
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}