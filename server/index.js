const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const Database = require('better-sqlite3');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3001;
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'messages.db');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database(DB_PATH);
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

app.get('/api/messages', (_req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM messages ORDER BY timestamp ASC').all();
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/messages', (req, res) => {
  try {
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
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to post message' });
  }
});

app.delete('/api/messages/:id', (req, res) => {
  try {
    const { name } = req.body;
    const id = Number(req.params.id);
    const msg = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
    if (!msg) return res.status(404).json({ error: 'Not found' });
    if (msg.name !== name) return res.status(403).json({ error: 'Forbidden' });
    db.prepare('DELETE FROM messages WHERE id = ?').run(id);
    broadcast({ type: 'delete_message', data: { id } });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

server.listen(PORT, () => {
  console.log(`Chat server listening on port ${PORT}`);
});
