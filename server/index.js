require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const http = require('http');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// In-memory message store
let messages = [];
let nextId = 1;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(data) {
  const str = JSON.stringify(data);
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(str);
  }
}

app.get('/api/messages', (_req, res) => {
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { name, team, message } = req.body;
  if (!name || !team || !message?.trim()) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const row = { id: nextId++, name, team, message: message.trim(), timestamp: Date.now() };
  messages.push(row);
  broadcast({ type: 'new_message', data: row });
  res.status(201).json(row);
});

app.delete('/api/messages/:id', (req, res) => {
  const { name } = req.body;
  const id = Number(req.params.id);
  const msg = messages.find((m) => m.id === id);
  if (!msg) return res.status(404).json({ error: 'Not found' });
  if (msg.name !== name) return res.status(403).json({ error: 'Forbidden' });
  messages = messages.filter((m) => m.id !== id);
  broadcast({ type: 'delete_message', data: { id } });
  res.json({ ok: true });
});

server.listen(PORT, () => {
  console.log(`Chat server listening on port ${PORT}`);
});
