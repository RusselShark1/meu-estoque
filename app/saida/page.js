'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Banco de dados com insumos de produção da Use Screen
const ESTOQUE_INICIAL = [
  { id: 'TS-05', nome: 'Tecido Screen 3% Cinza (Rolo 2.5m)', categoria: 'Tecidos', qtd: 15, min: 10 },
  { id: 'TB-38', nome: 'Tubo Superior Alumínio 38mm (Eixo)', categoria: 'Componentes', qtd: 30, min: 15 },
  { id: 'CM-01', nome: 'Kit Comando (Catraca + Ponta Oposta)', categoria: 'Componentes', qtd: 25, min: 10 },
  { id: 'SP-10', nome: 'Suportes Laterais com Tampas (Par)', categoria: 'Componentes', qtd: 40, min: 20 },
  { id: 'CR-01', nome: 'Corrente de Comando + Emenda + Limitador', categoria: 'Acessórios', qtd: 50, min: 15 },
  { id: 'PD-01', nome: 'Pêndulo / Balastro de Peso', categoria: 'Acessórios', qtd: 35, min: 10 },
  { id: 'BS-01', nome: 'Base Inferior Barra Niveladora', categoria: 'Componentes', qtd: 28, min: 10 },
  { id: 'BD-01', nome: 'Bandô de Acabamento em Alumínio', categoria: 'Opcionais', qtd: 12, min: 5 },
];

export default function SaidaInsumos() {
  const [estoque, setEstoque] = useState([]);
  const [tipoSaida, setTipoSaida] = useState('op'); // 'op' (Ordem de Produção) ou 'avulso' (Reposição)
  
  // Dados da Ordem de Produção
  const [numeroOP, setNumeroOP] = useState('');
  const [modeloPersiana, setModeloPersiana] = useState('Persiana Rolo Screen 3%');
  const [incluirBando, setIncluirBando] = useState(false);
  const [qtdKits, setQtdKits] = useState(1);

  // Dados da Saída Avulsa
  const [itemAvulso, setItemAvulso] = useState('');
  const [qtdAvulsa, setQtdAvulsa] = useState('');

  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    const dadosSalvos = localStorage.getItem('use_screen_estoque');
    if (dadosSalvos) {
      setEstoque(JSON.parse(dadosSalvos));
    } else {
      setEstoque(ESTOQUE_INICIAL);
      localStorage.setItem('use_screen_estoque', JSON.stringify(ESTOQUE_INICIAL));
    }
  }, []);

  // Baixa Automática por Ordem de Produção (O.P.)
  const handleBaixaOP = (e) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    if (!numeroOP) {
      setErroMsg('Por favor, informe o número da Ordem de Produção (O.P.).');
      return;
    }

    const multiplicador = Number(qtdKits) || 1;

    // Insumos que compõem a montagem da Persiana Rolo
    let componentesProducao = ['TS-05', 'TB-38', 'CM-01', 'SP-10', 'CR-01', 'PD-01', 'BS-01'];
    if (incluirBando) {
      componentesProducao.push('BD-01');
    }

    // Verificar saldo em estoque antes de autorizar a baixa
    for (let id of componentesProducao) {
      const item = estoque.find(p => p.id === id);
      if (!item || item.qtd < multiplicador) {
        setErroMsg(`Saldo insuficiente para o item: "${item ? item.nome : id}". Saldo atual: ${item ? item.qtd : 0}.`);
        return;
      }
    }

    // Abater itens do estoque
    const estoqueAtualizado = estoque.map(item => {
      if (componentesProducao.includes(item.id)) {
        return { ...item, qtd: item.qtd - multiplicador };
      }
      return item;
    });

    setEstoque(estoqueAtualizado);
    localStorage.setItem('use_screen_estoque', JSON.stringify(estoqueAtualizado));

    setSucessoMsg(`Saída por O.P. realizada! Abatidos os insumos para a ${numeroOP} (${multiplicador} unidade(s) de ${modeloPersiana}).`);
    setNumeroOP('');
    setQtdKits(1);
    setIncluirBando(false);

    setTimeout(() => setSucessoMsg(''), 5000);
  };

  // Saída Avulsa / Reposição
  const handleBaixaAvulsa = (e) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    if (!itemAvulso || !qtdAvulsa || Number(qtdAvulsa) <= 0) {
      setErroMsg('Selecione um insumo e informe uma quantidade válida.');
      return;
    }

    const item = estoque.find(p => p.id === itemAvulso);
    if (!item || item.qtd < Number(qtdAvulsa)) {
      setErroMsg(`Saldo insuficiente! Saldo atual de "${item?.nome}": ${item?.qtd || 0}.`);
      return;
    }

    const estoqueAtualizado = estoque.map(p => p.id === itemAvulso ? { ...p, qtd: p.qtd - Number(qtdAvulsa) } : p);
    setEstoque(estoqueAtualizado);
    localStorage.setItem('use_screen_estoque', JSON.stringify(estoqueAtualizado));

    setSucessoMsg(`Saída avulsa realizada: ${qtdAvulsa} un. de "${item.nome}".`);
    setItemAvulso('');
    setQtdAvulsa('');

    setTimeout(() => setSucessoMsg(''), 5000);
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
            <h1 className="text-lg font-bold text-[#333333] leading-tight">Saída de Materiais</h1>
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
        
        {/* Seleção do Tipo de Saída */}
        <div className="grid grid-cols-2 gap-3 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
          <button
            onClick={() => { setTipoSaida('op'); setErroMsg(''); }}
            className={`py-3 rounded-xl font-bold text-sm transition duration-200 ${
              tipoSaida === 'op'
                ? 'bg-[#F2B78E] text-[#333333] shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🏭 Saída por Ordem de Produção (O.P.)
          </button>
          <button
            onClick={() => { setTipoSaida('avulso'); setErroMsg(''); }}
            className={`py-3 rounded-xl font-bold text-sm transition duration-200 ${
              tipoSaida === 'avulso'
                ? 'bg-[#3A3B3C] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            🔧 Saída Avulsa / Reposição
          </button>
        </div>

        {/* Mensagens de Alerta */}
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

        {/* MODO 1: SAÍDA POR O.P. */}
        {tipoSaida === 'op' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#333333]">Baixa de Insumos por Ordem de Produção</h2>
              <p className="text-xs text-gray-500">Informe o número da O.P. para dar baixa automática em todos os componentes necessários para a montagem.</p>
            </div>

            <form onSubmit={handleBaixaOP} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Nº da O.P. / Pedido:</label>
                  <input 
                    type="text"
                    placeholder="Ex: OP-2026-01"
                    className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                    value={numeroOP}
                    onChange={(e) => setNumeroOP(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Modelo da Persiana:</label>
                  <select 
                    className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                    value={modeloPersiana}
                    onChange={(e) => setModeloPersiana(e.target.value)}
                  >
                    <option value="Persiana Rolo Screen 3%">Persiana Rolo Screen 3%</option>
                    <option value="Persiana Rolo Blackout">Persiana Rolo Blackout</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Quantidade de Persianas:</label>
                  <input 
                    type="number"
                    min="1"
                    className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                    value={qtdKits}
                    onChange={(e) => setQtdKits(e.target.value)}
                  />
                </div>
              </div>

              {/* Lista de Componentes Abatidos */}
              <div className="bg-[#F4F4F4]/60 p-5 rounded-2xl border border-gray-200 space-y-3">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider">
                  Insumos a serem baixados nesta O.P.:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2">✔️ Tecido da Persiana (Screen/Blackout)</div>
                  <div className="flex items-center gap-2">✔️ Tubo Superior (Eixo de Enrolamento)</div>
                  <div className="flex items-center gap-2">✔️ Kit Comando (Catraca + Ponta Oposta)</div>
                  <div className="flex items-center gap-2">✔️ Suportes Laterais com Tampas</div>
                  <div className="flex items-center gap-2">✔️ Corrente de Comando + Freio/Emenda</div>
                  <div className="flex items-center gap-2">✔️ Pêndulo Balastro de Peso</div>
                  <div className="flex items-center gap-2">✔️ Base Inferior Barra Niveladora</div>
                  <div className="flex items-center gap-2 col-span-full pt-1">
                    <input 
                      type="checkbox" 
                      id="bando" 
                      className="w-4 h-4 accent-[#F2B78E] rounded"
                      checked={incluirBando}
                      onChange={(e) => setIncluirBando(e.target.checked)}
                    />
                    <label htmlFor="bando" className="cursor-pointer text-[#333333] font-bold">
                      Incluir Bandô de Acabamento em Alumínio (Opcional)
                    </label>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#F2B78E] text-[#333333] hover:bg-[#ebae82] py-3.5 rounded-xl font-bold transition duration-200 text-sm shadow-sm shadow-[#F2B78E]/30"
              >
                🏭 Confirmar Baixa por Ordem de Produção
              </button>
            </form>
          </div>
        )}

        {/* MODO 2: SAÍDA AVULSA */}
        {tipoSaida === 'avulso' && (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#333333]">Saída Avulsa / Reposição de Estoque</h2>
              <p className="text-xs text-gray-500">Retire um insumo individualmente para manutenção, reposição ou ajuste de estoque.</p>
            </div>

            <form onSubmit={handleBaixaAvulsa} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Selecione o Insumo:</label>
                  <select 
                    className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                    value={itemAvulso}
                    onChange={(e) => setItemAvulso(e.target.value)}
                  >
                    <option value="">-- Escolha um insumo --</option>
                    {estoque.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.nome} (Saldo: {item.qtd})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Quantidade a Retirar:</label>
                  <input 
                    type="number"
                    placeholder="Ex: 2"
                    className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                    value={qtdAvulsa}
                    onChange={(e) => setQtdAvulsa(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#3A3B3C] text-white hover:bg-[#333333] py-3.5 rounded-xl font-bold transition duration-200 text-sm shadow-sm"
              >
                🔧 Confirmar Saída Avulsa
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}