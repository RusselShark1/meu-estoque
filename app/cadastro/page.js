'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Lista inicial de fallback caso o localStorage esteja vazio
const ESTOQUE_INICIAL = [
  { id: 'TS-01', nome: 'Tecido Tela Solar 1%', categoria: 'Tecidos', qtd: 120, min: 30 },
  { id: 'TB-32', nome: 'Tubo 32 mm (Barra 6m)', categoria: 'Componentes', qtd: 60, min: 18 },
  { id: 'BI-01', nome: 'Barra Inferior (Barra 6m)', categoria: 'Componentes', qtd: 48, min: 12 },
  { id: 'CR-10', nome: 'Corrente Bola 10 (Rolo 250m)', categoria: 'Acessórios', qtd: 250, min: 50 },
  { id: 'KC-01', nome: 'Kit Comando (Catraca + Ponteira)', categoria: 'Componentes', qtd: 25, min: 10 },
];

export default function CadastroInsumos() {
  const [estoque, setEstoque] = useState([]);
  
  // Campos do Formulário
  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Componentes');
  const [qtdAtual, setQtdAtual] = useState('');
  const [estoqueMin, setEstoqueMin] = useState('');

  const [sucessoMsg, setSucessoMsg] = useState('');
  const [erroMsg, setErroMsg] = useState('');

  // Carregar dados salvos no localStorage
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('use_screen_estoque');
    if (dadosSalvos) {
      setEstoque(JSON.parse(dadosSalvos));
    } else {
      setEstoque(ESTOQUE_INICIAL);
      localStorage.setItem('use_screen_estoque', JSON.stringify(ESTOQUE_INICIAL));
    }
  }, []);

  // Cadastrar Novo Insumo
  const handleSalvarItem = (e) => {
    e.preventDefault();
    setErroMsg('');
    setSucessoMsg('');

    // Validação de campos obrigatórios
    if (!codigo.trim() || !nome.trim() || !qtdAtual || !estoqueMin) {
      setErroMsg('Por favor, preencha todos os campos do formulário.');
      return;
    }

    const codigoFormatado = codigo.trim().toUpperCase();

    // Validação de duplicidade de código
    const jaExiste = estoque.some(item => item.id.toUpperCase() === codigoFormatado);
    if (jaExiste) {
      setErroMsg(`Já existe um insumo cadastrado com o código "${codigoFormatado}".`);
      return;
    }

    // Criar novo objeto de insumo
    const novoItem = {
      id: codigoFormatado,
      nome: nome.trim(),
      categoria,
      qtd: Number(qtdAtual),
      min: Number(estoqueMin)
    };

    // Atualizar estado e persistir no localStorage
    const estoqueAtualizado = [novoItem, ...estoque];
    setEstoque(estoqueAtualizado);
    localStorage.setItem('use_screen_estoque', JSON.stringify(estoqueAtualizado));

    setSucessoMsg(`Insumo "${novoItem.nome}" (${novoItem.id}) cadastrado com sucesso!`);

    // Limpar formulário
    setCodigo('');
    setNome('');
    setCategoria('Componentes');
    setQtdAtual('');
    setEstoqueMin('');

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
            <h1 className="text-lg font-bold text-[#333333] leading-tight">Cadastrar Novo Insumo</h1>
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
      <main className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
        
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

        {/* Formulário de Cadastro */}
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#333333]">📝 Formulário de Cadastro de Material</h2>
            <p className="text-xs text-gray-500">Insira os dados do novo insumo para inclusão no catálogo oficial da Use Screen.</p>
          </div>

          <form onSubmit={handleSalvarItem} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Código */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Código do Insumo:</label>
                <input 
                  type="text"
                  placeholder="Ex: TS-02, TB-40, KC-02"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono font-bold focus:outline-none focus:border-[#F2B78E]"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Categoria:</label>
                <select 
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="Tecidos">Tecidos</option>
                  <option value="Componentes">Componentes</option>
                  <option value="Motores">Motores</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="Opcionais">Opcionais</option>
                </select>
              </div>

            </div>

            {/* Nome do Insumo */}
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Nome Completo do Insumo:</label>
              <input 
                type="text"
                placeholder="Ex: Tecido Screen 5% Bege (Rolo 3.0m)"
                className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Quantidade Inicial */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Quantidade Inicial em Estoque:</label>
                <input 
                  type="number"
                  min="0"
                  placeholder="Ex: 50"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={qtdAtual}
                  onChange={(e) => setQtdAtual(e.target.value)}
                />
              </div>

              {/* Estoque Mínimo */}
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Estoque Mínimo (Alerta de Reposição):</label>
                <input 
                  type="number"
                  min="1"
                  placeholder="Ex: 15"
                  className="w-full bg-[#F4F4F4] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F2B78E]"
                  value={estoqueMin}
                  onChange={(e) => setEstoqueMin(e.target.value)}
                />
              </div>

            </div>

            <button 
              type="submit"
              className="w-full bg-[#F2B78E] text-[#333333] hover:bg-[#ebae82] py-3.5 rounded-xl font-bold transition duration-200 text-sm shadow-sm shadow-[#F2B78E]/30"
            >
              ➕ Salvar e Cadastrar Insumo
            </button>

          </form>
        </div>

        {/* Lista de Itens Já Cadastrados */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-md text-[#333333]">📦 Insumos Cadastrados no Sistema ({estoque.length})</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4F4F4] font-bold text-gray-500 uppercase">
                  <th className="py-2.5 px-4">Código</th>
                  <th className="py-2.5 px-4">Nome</th>
                  <th className="py-2.5 px-4">Categoria</th>
                  <th className="py-2.5 px-4 text-center">Qtd Atual</th>
                  <th className="py-2.5 px-4 text-center">Estoque Mín</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {estoque.slice(0, 5).map(item => (
                  <tr key={item.id} className="hover:bg-[#F4F4F4]/40">
                    <td className="py-3 px-4 font-mono font-bold text-[#3A3B3C]">{item.id}</td>
                    <td className="py-3 px-4 text-[#333333] font-semibold">{item.nome}</td>
                    <td className="py-3 px-4">{item.categoria}</td>
                    <td className="py-3 px-4 text-center font-bold">{item.qtd}</td>
                    <td className="py-3 px-4 text-center text-gray-500">{item.min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}