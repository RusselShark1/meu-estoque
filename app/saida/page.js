'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SaidaEstoque() {
  const [estoque, setEstoque] = useState([]);
  const [modo, setModo] = useState('avulso'); // 'avulso' ou 'op'
  const [carregando, setCarregando] = useState(true);

  // Formulário - Saída Avulsa Direta
  const [itemSelecionado, setItemSelecionado] = useState('');
  const [qtdRetirar, setQtdRetirar] = useState('');
  const [motivo, setMotivo] = useState('Retirada de Almoxarifado');

  // Formulário - Saída por O.P.
  const [numeroOP, setNumeroOP] = useState('');
  const [larguraMM, setLarguraMM] = useState('');
  const [alturaMM, setAlturaMM] = useState('');
  const [quantidadeOP, setQuantidadeOP] = useState('1');

  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Carregar lista de insumos do banco
  const carregarEstoque = async () => {
    try {
      setCarregando(true);
      const res = await fetch('/api/estoque');
      if (res.ok) {
        const dados = await res.json();
        setEstoque(dados);
      }
    } catch (err) {
      console.error('Erro ao carregar estoque:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarEstoque();
  }, []);

  const itemAtual = estoque.find(i => i.id === itemSelecionado);

  // 1. Processar Saída Avulsa / Direta
  const handleBaixaAvulsa = async (e) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    if (!itemSelecionado || !qtdRetirar || Number(qtdRetirar) <= 0) {
      setErroMsg('Selecione um insumo e informe uma quantidade válida.');
      return;
    }

    if (itemAtual && Number(itemAtual.qtd) < Number(qtdRetirar)) {
      setErroMsg(`Saldo insuficiente! Saldo atual em estoque: ${itemAtual.qtd} ${itemAtual.unidade || 'mm'}.`);
      return;
    }

    setEnviando(true);

    try {
      const res = await fetch('/api/estoque/saida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: itemSelecionado,
          quantidade: Number(qtdRetirar),
          motivo
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSucessoMsg(`Retirada de ${qtdRetirar} ${itemAtual?.unidade || 'mm'} realizada com sucesso para "${itemAtual?.nome}"!`);
        setItemSelecionado('');
        setQtdRetirar('');
        await carregarEstoque();
      } else {
        setErroMsg(data.error || 'Erro ao registrar a retirada.');
      }
    } catch (err) {
      setErroMsg('Falha na comunicação com o servidor.');
    } finally {
      setEnviando(false);
      setTimeout(() => setSucessoMsg(''), 5000);
    }
  };

  // 2. Processar Saída por O.P. (Calculadora de Medidas)
  const largMM = parseInt(larguraMM) || 0;
  const altMM = parseInt(alturaMM) || 0;
  const qtdOP = parseInt(quantidadeOP) || 1;

  const consumoTecidoMM = altMM * qtdOP;
  const consumoTuboMM = largMM * qtdOP;
  const consumoBarraInfMM = largMM * qtdOP;
  const consumoCorrenteMM = altMM * 2 * qtdOP;
  const consumoFitaBaseMM = largMM * qtdOP;
  const consumoDuplaFaceMM = largMM * qtdOP;
  const consumoKitComando = 1 * qtdOP;
  const consumoTampaBase = 1 * qtdOP;

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

    for (let id in mapaConsumo) {
      const item = estoque.find(p => p.id === id);
      if (item && Number(item.qtd) < mapaConsumo[id]) {
        setErroMsg(`Saldo insuficiente de "${item.nome}". Necessário: ${mapaConsumo[id]} ${item.unidade}, Saldo atual: ${item.qtd} ${item.unidade}.`);
        return;
      }
    }

    setEnviando(true);

    try {
      const res = await fetch('/api/estoque/saida', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapaConsumo, numeroOP })
      });

      const data = await res.json();

      if (res.ok) {
        setSucessoMsg(`O.P. ${numeroOP} (${largMM} mm × ${altMM} mm) baixada com sucesso!`);
        setNumeroOP('');
        setLarguraMM('');
        setAlturaMM('');
        setQuantidadeOP('1');
        await carregarEstoque();
      } else {
        setErroMsg(data.error || 'Erro ao registrar a baixa por O.P.');
      }
    } catch (err) {
      setErroMsg('Falha na comunicação com o servidor.');
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
              <h1 className="text-base font-bold text-[#333333]">Saída / Retirada de Estoque</h1>
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
              href="/entrada" 
              className="bg-white text-[#333333] hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              ➕ Entrada
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-6">
        
        {/* Alternador de Modo */}
        <div className="grid grid-cols-2 gap-3 bg-white p-2 rounded-2xl border border-gray-200/80 shadow-sm">
          <button
            onClick={() => { setModo('avulso'); setErroMsg(''); setSucessoMsg(''); }}
            className={`py-3 rounded-xl font-bold text-xs md:text-sm transition ${
              modo === 'avulso'
                ? 'bg-[#3A3B3C] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🔧 Saída Avulsa / Direta de Material
          </button>
          <button
            onClick={() => { setModo('op'); setErroMsg(''); setSucessoMsg(''); }}
            className={`py-3 rounded-xl font-bold text-xs md:text-sm transition ${
              modo === 'op'
                ? 'bg-[#F2B78E] text-[#333333] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🏭 Saída por Ordem de Produção (O.P.)
          </button>
        </div>

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

        {/* MODO 1: SAÍDA AVULSA / DIRETA */}
        {modo === 'avulso' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#333333]">🔧 Retirada Direta de Insumo</h2>
              <p className="text-xs text-gray-500">Selecione o material cadastrado no estoque e informe a quantidade a ser retirada.</p>
            </div>

            <form onSubmit={handleBaixaAvulsa} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Selecione o Insumo:</label>
                  <select 
                    className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                    value={itemSelecionado}
                    onChange={(e) => setItemSelecionado(e.target.value)}
                  >
                    <option value="">-- Escolha o item do estoque --</option>
                    {estoque.map(item => (
                      <option key={item.id} value={item.id}>
                        [{item.id}] {item.nome} — Saldo: {item.qtd} {item.unidade || 'mm'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Motivo da Retirada:</label>
                  <input 
                    type="text"
                    placeholder="Ex: Reposição, Manutenção, Refugo"
                    className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                  />
                </div>
              </div>

              {itemAtual && (
                <div className="bg-[#F2B78E]/15 border border-[#F2B78E]/40 p-4 rounded-xl flex items-center justify-between text-xs font-bold text-[#333333]">
                  <span>Item Selecionado: <strong>{itemAtual.nome}</strong></span>
                  <span>Saldo Atual: <strong className="bg-white px-2.5 py-0.5 rounded shadow-xs">{itemAtual.qtd} {itemAtual.unidade || 'mm'}</strong></span>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">
                  Quantidade a Retirar {itemAtual ? `(${itemAtual.unidade || 'mm'})` : '(mm ou un)'}:
                </label>
                <input 
                  type="number"
                  placeholder={itemAtual?.unidade === 'un' ? 'Ex: 2' : 'Ex: 1500 (para 1.500 mm)'}
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-[#F2B78E]"
                  value={qtdRetirar}
                  onChange={(e) => setQtdRetirar(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                disabled={enviando}
                className="w-full bg-[#3A3B3C] text-white hover:bg-[#333333] py-3.5 rounded-xl font-bold transition text-sm shadow-sm disabled:opacity-50"
              >
                {enviando ? 'Gravando...' : '🔧 Confirmar Retirada do Material'}
              </button>
            </form>
          </div>
        )}

        {/* MODO 2: SAÍDA POR O.P. */}
        {modo === 'op' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#333333]">🏭 Saída por Ordem de Produção (O.P.)</h2>
              <p className="text-xs text-gray-500">Informe a Largura e Altura em milímetros (mm) para calcular a baixa de todo o kit da persiana rolo.</p>
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
                    value={quantidadeOP}
                    onChange={(e) => setQuantidadeOP(e.target.value)}
                  />
                </div>
              </div>

              {largMM > 0 && altMM > 0 && (
                <div className="bg-[#F4F4F4]/80 p-5 rounded-2xl border border-gray-200 space-y-3">
                  <h3 className="text-xs font-black text-gray-600 uppercase tracking-wider">
                    Consumo Calculado para Abate (em mm e unidades):
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
                disabled={enviando}
                className="w-full bg-[#F2B78E] text-[#333333] hover:bg-[#ebae82] py-3.5 rounded-xl font-bold transition text-sm shadow-sm disabled:opacity-50"
              >
                {enviando ? 'Processando...' : '🏭 Confirmar Baixa da O.P.'}
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}