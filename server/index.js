require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const Database = require('better-sqlite3');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173'];

const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

// SQLite
const db = new Database(path.join(__dirname, 'messages.db'));
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT    NOT NULL,
    team      TEXT    NOT NULL,
    message   TEXT    NOT NULL,
    timestamp INTEGER NOT NULL
  )
`);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(data) {
  const str = JSON.stringify(data);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(str);
  }
}

// GET all messages
app.get('/api/messages', (_req, res) => {
  const rows = db.prepare('SELECT * FROM messages ORDER BY timestamp ASC').all();
  res.json(rows);
});

// POST new message
app.post('/api/messages', (req, res) => {
  const { name, team, message } = req.body;
  if (!name || !team || !message?.trim()) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const timestamp = Date.now();
  const result = db
    .prepare('INSERT INTO messages (name, team, message, timestamp) VALUES (?, ?, ?, ?)')
    .run(name, team, message.trim(), timestamp);

  const row = { id: result.lastInsertRowid, name, team, message: message.trim(), timestamp };
  broadcast({ type: 'new_message', data: row });
  res.status(201).json(row);
});

// DELETE a message (only owner can delete)
app.delete('/api/messages/:id', (req, res) => {
  const { name } = req.body;
  const id = Number(req.params.id);

  const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
  if (!msg) return res.status(404).json({ error: 'Not found' });
  if (msg.name !== name) return res.status(403).json({ error: 'Forbidden' });

  db.prepare('DELETE FROM messages WHERE id = ?').run(id);
  broadcast({ type: 'delete_message', data: { id } });
  res.json({ ok: true });
});

server.listen(PORT, () => {
  console.log(`Chat server listening on port ${PORT}`);
});
