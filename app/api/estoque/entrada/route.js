import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      return NextResponse.json({ error: "String de conexão não encontrada" }, { status: 500 });
    }

    const body = await request.json();
    
    // Aceita tanto 'id' quanto 'codigo' e várias opções para a quantidade
    const id = body.id || body.codigo;
    const qtd = body.qtd !== undefined ? body.qtd : (body.quantidade !== undefined ? body.quantidade : body.qtdAdicionar);

    if (!id || qtd === undefined) {
      return NextResponse.json({ error: 'ID/Código e quantidade são obrigatórios.' }, { status: 400 });
    }

    const sql = neon(connectionString);

    // Soma a quantidade nova ao saldo atual no banco
    await sql`
      UPDATE estoque 
      SET qtd = qtd + ${Number(qtd)}
      WHERE id = ${id};
    `;

    return NextResponse.json({ success: true, message: 'Entrada registrada com sucesso!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}