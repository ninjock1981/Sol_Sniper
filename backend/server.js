// server.js
import express from 'express';
import { WebSocketServer } from 'ws';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // učitava .env fajl (ako koristiš lokalno)

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Inicijalizacija SQLite konekcije
let db;
const initDb = async () => {
  db = await open({
    filename: './sol_sniper.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sniper_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Pokretanje HTTP servera
const server = app.listen(port, async () => {
  await initDb();
  console.log(`✅ Server radi na http://localhost:${port}`);
});

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('🟢 WebSocket klijent povezan');

  ws.on('message', async (data) => {
    const message = data.toString();
    console.log('📨 Poruka:', message);

    try {
      await db.run('INSERT INTO sniper_logs (message) VALUES (?)', [message]);
      ws.send('✔️ Poruka primljena i sačuvana.');
    } catch (err) {
      console.error('❌ DB error:', err.message);
      ws.send('⚠️ Greška prilikom upisa u bazu.');
    }
  });

  ws.on('close', () => {
    console.log('🔌 Klijent se diskonektovao');
  });
});
