PROJETO INTEGRADOR II - GRUPO 22 - UNIVESP - 2026 - Eixo de Computação - Sistema de Controle de Estoque Use Screen
Este projeto visa desenvolver uma aplicação de gerenciamento de estoque para uma empresa de persianas da região oeste de são paulo.
O projeto foi estruturado com foco em usabilidade (Design Thinking) e desenvolvido utilizando tecnologias modernas de desenvolvimento web

Aplicação Web para Gestão de Almoxarifado Industrial e Corte Sob Medida
Desenvolvido para a Use Screen — Cortinas e Persianas, integrando o ecossistema Next.js, banco de dados PostgreSQL serverless e a metodologia Design Thinking aplicada ao chão de fábrica.

1. Visão Geral do Projeto
O Sistema de Controle de Estoque da Use Screen é um software de gestão logística desenvolvido como entregável principal do Projeto Integrador II. A aplicação foi projetada sob medida para resolver os desafios operacionais de uma fábrica de cortinas e persianas manuais e motorizadas, onde o inventário combina matérias-primas fracionadas sob medida (tecidos e perfis de alumínio) com componentes eletrônicos e miudezas industriais.

Problema de Negócio Resolvido
Em uma fábrica de persianas, a matéria-prima é adquirida em grande escala (rolos de tecido, barras de alumínio de 6 metros, rolos de correntes) e consumida de forma fracionada de acordo com as dimensões específicas de cada pedido de cliente. O sistema elimina falhas manuais de digitação, furos de estoque e desperdícios acumulados ao automatizar a Estrutura de Produto (Bill of Materials — BOM) e padronizar o controle físico 100% em milímetros (mm) e unidades (un).

2. Metodologia Aplicada: Design Thinking
O desenvolvimento da solução seguiu os fundamentos do Design Thinking, abordando o projeto a partir de três pilares centrais: Empatia, Colaboração e Experimentação.

Imersão Profunda & Mapeamento POEMS: Investigação no chão de fábrica e na bancada de corte para observar os atores (People), insumos (Objects), ambiente de montagem (Environment), ordens de produção (Messages) e fluxos de recebimento (Services).
Definição e Personas: Foco nas dores do Operador de Corte (necessidade de agilidade e medição direta em mm na trena) e do Almoxarife/Gerente de Compras (necessidade de alertas automáticos de ponto de pedido).
Ideação & Explosão de Materiais (BOM Dinâmica): Desenvolvimento da regra de negócio que recebe a Largura (mm) e Altura (mm) de uma Ordem de Produção (O.P.) e realiza o abate proporcional automático de todos os insumos (tubo, barra inferior, tecido, corrente, fitas e kits de comando).
Prototipagem Iterativa: Evolução de wireframes em papel para um Mínimo Produto Viável (MVP) full-stack conectado a banco de dados relacional em nuvem.
3. Arquitetura do Sistema (4 Telas)
A aplicação utiliza o App Router do Next.js, onde a hierarquia de pastas reflete a navegação entre as quatro telas funcionais do sistema:

app/
├── page.js          ➔ Tela 1: Consulta e Painel de Alertas de Estoque Crítico
├── entrada/
│   └── page.js      ➔ Tela 2: Entrada e Recebimento de Materiais no Almoxarifado
├── saida/
│   └── page.js      ➔ Tela 3: Central de Saída (O.P. em mm & Saída Avulsa)
├── cadastro/
│   └── page.js      ➔ Tela 4: Cadastro de Novos Insumos e Estoque Mínimo
├── api/
│   └── estoque/     ➔ Endpoints de Backend e Comunicação com Banco SQL
├── layout.js        ➔ Layout Global e Estilização Base
├── globals.css      ➔ Regras do Tailwind CSS e Fontes
└── icon.svg         ➔ Favicon / Ícone Oficial da Aplicação


Funcionalidades por Tela

Consulta de Estoque (/): Painel de busca em tempo real por código ou nome do insumo, com cartões de indicadores de inventário total e sinalização automática de status (Normal em verde vs. Abaixo do Mínimo em vermelho).
Entrada de Materiais (/entrada): Formulário para adição rápida de saldo físico ao almoxarifado em milímetros ou unidades, com suporte a registro de Nota Fiscal e documento de recebimento.
Saída de Estoque (/saida): Sistema com duplo modo de operação:
Saída Avulsa / Direta: Retirada pontual de materiais para manutenção, ajuste ou refugo.
Saída por Ordem de Produção (O.P.): Calculadora que processa as medidas em milímetros ($\text{Largura} \times \text{Altura}$) e abate a metragem exata da lista de componentes do kit da persiana.
Cadastro de Insumos (/cadastro): Módulo de inclusão de novos materiais no catálogo oficial, definindo código SKU, categoria, unidade de medida (mm ou un) e limite de segurança (Estoque Mínimo).
4. Stack Tecnológico e Ferramentas Utilizadas
A stack de tecnologia foi selecionada para garantir alta performance, renderização ágil no servidor, tipografia responsiva e suporte a operações serverless na nuvem.

Categoria	Tecnologia / Ferramenta	Aplicação no Projeto
Linguagem Base	JavaScript (ES6+)	Linguagem principal para desenvolvimento das rotas de backend, componentes React e lógica de cálculo de materiais.
Framework Full-Stack	Next.js (App Router)	Framework React full-stack para renderização híbrida no servidor, roteamento dinâmico baseado em arquivos e API Route Handlers.
Biblioteca de UI	React	Construção de interfaces orientadas a componentes reutilizáveis, gerenciamento de estado (useState) e efeitos de ciclo de vida (useEffect).
Estilização & CSS	Tailwind CSS	Framework utilitário de CSS para estilização responsiva, layout em Grid/Flexbox e aplicação da identidade visual oficial.
Fontes & Tipografia	Geist & Geist Mono (next/font)	Otimização nativa de tipografia desenvolvida para o ecossistema Vercel, garantindo alta legibilidade e estilo moderno.
Banco de Dados	Neon Database / PostgreSQL	Banco de dados relacional Serverless PostgreSQL hospedado em nuvem, garantindo persistência real e conexões distribuídas.
Driver de Conexão	@neondatabase/serverless	SDK oficial para execução de consultas SQL assíncronas diretas via funções serverless da API do Next.js.
Ambiente Executivo	Node.js (LTS)	Ambiente de execução JavaScript no servidor e gerenciador de pacotes npm para instalação de dependências.
Hospedagem & Cloud	Vercel	Plataforma de nuvem para hospedagem serverless, deploy contínuo (CI/CD), SSL automático e Preview Deployments.
Controle de Versão	Git & GitHub	Versionamento de código-fonte, rastreamento de alterações e integração contínua acionando compilações automáticas na Vercel.
Gerenciador de Pacotes	Windows Package Manager (winget)	Ferramenta de linha de comando para instalação e atualização do ambiente de desenvolvimento Node.js no Windows.
IDE & Edição	Visual Studio Code (VS Code)	Ambiente de desenvolvimento integrado para codificação, debugging e gerenciamento de arquivos de projeto.
Terminal / CLI	Bash / Git Bash / PowerShell	Interface de linha de comando para execução de scripts de desenvolvimento (npm run dev) e comandos de controle de versão.
5. Modelagem do Banco de Dados (PostgreSQL / Neon)
O banco de dados armazena as quantidades físicas em inteiros para evitar problemas de arredondamento decimal, registrando tecidos, perfis e fitas em milímetros (mm) e miudezas em unidades (un).

-- Estrutura da Tabela Principal de Estoque Físico
CREATE TABLE IF NOT EXISTS estoque (
  id VARCHAR(20) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  qtd BIGINT NOT NULL DEFAULT 0,    -- Quantidade em milímetros (mm) ou unidades (un)
  min BIGINT NOT NULL DEFAULT 0,    -- Estoque Mínimo em milímetros (mm) ou unidades (un)
  unidade VARCHAR(10) NOT NULL DEFAULT 'mm' -- 'mm' para materiais medidos ou 'un' para peças
);

-- Inserção do Catálogo Inicial Oficial da Use Screen
INSERT INTO estoque (id, nome, categoria, qtd, min, unidade) VALUES
('TS-01', 'Tecido Tela Solar 1%', 'Tecidos', 30000, 10000, 'mm'),     -- 30,00 m = 30.000 mm
('TB-32', 'Tubo 32 mm (Barra 6m)', 'Componentes', 12000, 6000, 'mm'),  -- 12,00 m = 12.000 mm
('BI-01', 'Barra Inferior (Barra 6m)', 'Componentes', 12000, 6000, 'mm'),-- 12,00 m = 12.000 mm
('CR-10', 'Corrente Bola 10', 'Acessórios', 50000, 10000, 'mm'),       -- 50,00 m = 50.000 mm
('FT-01', 'Fita da Base', 'Acessórios', 7000, 2000, 'mm'),            -- 7,00 m = 7.000 mm
('DF-01', 'Fita Dupla Face', 'Acessórios', 50000, 10000, 'mm'),        -- 50,00 m = 50.000 mm
('KC-01', 'Kit Comando (Catraca + Ponteira)', 'Componentes', 25, 10, 'un'),
('TP-01', 'Tampa da Base (Par)', 'Componentes', 30, 10, 'un')
ON CONFLICT (id) DO NOTHING;
6. Identidade Visual e Guia de Cores
A interface segue rigorosamente a marca oficial da Use Screen, combinando neutralidade funcional para o ambiente de fábrica com destaques para alertas e botões de ação:

Cinza Chumbo Escuro (#3A3B3C): Utilizado em botões de ação principal, cabeçalhos e elementos de destaque da marca.
Pêssego / Laranja Claro (#F2B78E): Utilizado para botões secundários, destaques de navegabilidade e etiquetas ativas.
Cinza Quase Preto (#333333): Cor para textos de leitura, títulos e dados numéricos, garantindo contraste elevado.
Cinza Neutro Claro (#F4F4F4): Fundo principal da aplicação e de cartões de informações.
Verde Status (#25D366): Indicador de sistema ativo e situação de estoque saudável.
Vermelho Alerta (#EF4444): Destaque visual para insumos que atingiram o limite de Estoque Mínimo.
7. Instruções de Instalação e Execução Local
Pré-requisitos
Node.js v18.0.0 ou superior instalado.
Gerenciador de pacotes npm ativo.
Passo a Passo
Clonar o Repositório:

git clone https://github.com/SEU-USUARIO/meu-estoque.git
cd meu-estoque
Instalar as Dependências:

npm install
Configurar as Variáveis de Ambiente: Crie um arquivo .env.local na raiz do projeto contendo a chave de conexão do banco de dados:

DATABASE_URL="postgresql://usuario:senha@ep-xyz.us-east-2.aws.neon.tech/neondatabase?sslmode=require"
Executar o Servidor de Desenvolvimento:

npm run dev
Acessar a Aplicação: Abra o navegador no endereço http://localhost:3000.

8. Publicação em Nuvem (Deploy)
A hospedagem em produção é realizada na plataforma Vercel com deploy contínuo integrado ao GitHub:

A cada commit enviado para a branch principal (git push origin main), a Vercel aciona uma compilação automatizada.
O sistema é publicado em ambiente serverless de alta performance.
9. Licença e Créditos
Projeto desenvolvido como parte do Projeto Integrador II, aplicado aos processos industriais da Use Screen — Cortinas e Persianas.
