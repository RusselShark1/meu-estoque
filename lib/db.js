import { neon } from '@neondatabase/serverless';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("A string de conexão do banco de dados não foi encontrada nas variáveis de ambiente.");
}

export const sql = neon(connectionString);