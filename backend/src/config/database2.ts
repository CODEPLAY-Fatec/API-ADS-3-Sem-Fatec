import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let connection: mysql.Connection;

export const connectDb = async () => {
  if (!connection) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      console.log('Conectado ao banco de dados.');
    } catch (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      throw err;
    }
  }
  return connection;
};

export const db = {
  query: async (query: string, values?: any) => {
    const conn = await connectDb();
    return conn.execute(query, values);
  },
  typedQuery: async <T>(query: string, values?: any) => {
    const rows = await db.query(query, values).then((rows) => rows[0]) as unknown as T[];
    return rows;
  }
};
