import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      return NextResponse.json({ success: false, erro: "Variável POSTGRES_URL não encontrada no .env.local" }, { status: 500 });
    }

    const sql = neon(connectionString);
    const response = await sql`SELECT NOW();`;
    
    return NextResponse.json({ 
      success: true, 
      mensagem: "Conexão com o Neon realizada com sucesso!",
      horarioBanco: response[0] 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      erroDetalhado: error.message 
    }, { status: 500 });
  }
}