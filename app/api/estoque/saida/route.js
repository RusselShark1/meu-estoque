import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();

    // MODO 1: Saída Avulsa / Direta de um Insumo Específico
    if (body.id && body.quantidade) {
      const { id, quantidade } = body;
      const qtdNum = Number(quantidade);

      const result = await sql`
        UPDATE estoque 
        SET qtd = qtd - ${qtdNum} 
        WHERE id = ${id} AND qtd >= ${qtdNum}
        RETURNING *;
      `;

      if (result.length === 0) {
        return NextResponse.json(
          { error: 'Saldo insuficiente em estoque ou item não encontrado.' },
          { status: 400 }
        );
      }

      return NextResponse.json({ message: 'Retirada realizada com sucesso!' });
    }

    // MODO 2: Saída por Ordem de Produção (Calculadora de Lote)
    if (body.mapaConsumo) {
      const { mapaConsumo } = body;

      for (const [id, quantidadeMM] of Object.entries(mapaConsumo)) {
        const qtdNum = Number(quantidadeMM);
        if (qtdNum > 0) {
          await sql`
            UPDATE estoque 
            SET qtd = qtd - ${qtdNum} 
            WHERE id = ${id} AND qtd >= ${qtdNum};
          `;
        }
      }

      return NextResponse.json({ message: 'Baixa de O.P. realizada com sucesso!' });
    }

    return NextResponse.json({ error: 'Dados inválidos para retirada.' }, { status: 400 });
  } catch (error) {
    console.error('Erro na API de saída:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}