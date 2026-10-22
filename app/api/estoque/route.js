import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      return NextResponse.json({ error: "String de conexão não encontrada" }, { status: 500 });
    }

    const sql = neon(connectionString);
    const itens = await sql`SELECT * FROM estoque ORDER BY categoria, nome;`;
    return NextResponse.json(itens, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      return NextResponse.json({ error: "String de conexão não encontrada" }, { status: 500 });
    }

    const body = await request.json();
    const { id, nome, categoria, qtd, min, unidade } = body;

    if (!id || !nome || categoria === undefined || qtd === undefined) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 });
    }

    const sql = neon(connectionString);

    await sql`
      INSERT INTO estoque (id, nome, categoria, qtd, min, unidade)
      VALUES (${id}, ${nome}, ${categoria}, ${qtd}, ${min}, ${unidade})
      ON CONFLICT (id) 
      DO UPDATE SET 
        nome = EXCLUDED.nome,
        categoria = EXCLUDED.categoria,
        qtd = EXCLUDED.qtd,
        min = EXCLUDED.min,
        unidade = EXCLUDED.unidade;
    `;

    return NextResponse.json({ success: true, message: 'Insumo salvo com sucesso!' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}