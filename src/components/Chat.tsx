import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Trash2 } from 'lucide-react';
import { east, west } from '../data/players';
import { useScrollLock } from '../utils/useScrollLock';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:3001';
const LS_NAME = 'ryder_chat_name';
const LS_TEAM = 'ryder_chat_team';
const LS_LAST_SEEN = 'ryder_chat_last_seen';

interface Message {
  id: number;
  name: string;
  team: 'east' | 'west';
  message: string;
  timestamp: number;
}

const EAST_PLAYERS = Object.values(east).map((name) => ({ name, team: 'east' as const }));
const WEST_PLAYERS = Object.values(west).map((name) => ({ name, team: 'west' as const }));

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return (
    d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  );
}

export default function Chat() {
  const [open, setOpen] = useState(false);
  useScrollLock(open);
  const [selectedName, setSelectedName] = useState<string | null>(
    () => localStorage.getItem(LS_NAME),
  );
  const [selectedTeam, setSelectedTeam] = useState<'east' | 'west' | null>(
    () => localStorage.getItem(LS_TEAM) as 'east' | 'west' | null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const openRef = useRef(open);
  useEffect(() => { openRef.current = open; }, [open]);

  // WebSocket
  const connectWS = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'new_message') {
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.data.id)) return prev;
            return [...prev, msg.data];
          });
          if (!openRef.current) setUnread((n) => n + 1);
        } else if (msg.type === 'delete_message') {
          setMessages((prev) => prev.filter((m) => m.id !== msg.data.id));
        }
      } catch {}
    };
    ws.onclose = () => setTimeout(connectWS, 3000);
  }, []);

  useEffect(() => {
    connectWS();
    return () => wsRef.current?.close();
  }, [connectWS]);

  // Fetch history when name selected
  useEffect(() => {
    if (!selectedName) return;
    fetch(`${API_URL}/messages`)
      .then((r) => r.json())
      .then((data: Message[]) => {
        setMessages(data);
        const lastSeen = Number(localStorage.getItem(LS_LAST_SEEN) ?? 0);
        setUnread(data.filter((m) => m.id > lastSeen).length);
      })
      .catch(console.error);
  }, [selectedName]);

  // Scroll to bottom + mark read when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      if (messages.length > 0) {
        const maxId = Math.max(...messages.map((m) => m.id));
        localStorage.setItem(LS_LAST_SEEN, String(maxId));
        setUnread(0);
      }
    }
  }, [open]);

  // Scroll when new messages arrive while open
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const selectPlayer = (name: string, team: 'east' | 'west') => {
    setSelectedName(name);
    setSelectedTeam(team);
    localStorage.setItem(LS_NAME, name);
    localStorage.setItem(LS_TEAM, team);
  };

  const clearPlayer = () => {
    setSelectedName(null);
    setSelectedTeam(null);
    localStorage.removeItem(LS_NAME);
    localStorage.removeItem(LS_TEAM);
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedName || !selectedTeam || sending) return;
    const text = input.trim();
    setInput('');
    setSending(true);
    try {
      await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedName, team: selectedTeam, message: text }),
      });
    } catch {
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!selectedName) return;
    try {
      await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedName }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gold rounded-full shadow-xl flex items-center justify-center hover:bg-gold/90 active:scale-95 transition-all"
      >
        <MessageCircle size={22} strokeWidth={2} className="text-navy-900" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-east text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Full-screen modal */}
      {open && (
        <div
          className="fixed inset-x-0 top-0 z-50 flex flex-col bg-slate-900"
          style={{ height: '100dvh' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <MessageCircle size={17} className="text-gold" />
              <div>
                <h2 className="text-white font-serif font-bold text-base leading-none">
                  Ryder Cup Chat
                </h2>
                {selectedName && selectedTeam && (
                  <p className={`text-xs mt-0.5 flex items-center gap-1.5 ${selectedTeam === 'east' ? 'text-east-light' : 'text-west-light'}`}>
                    Chatting as {selectedName}
                    <button onClick={clearPlayer} className="text-slate-500 hover:text-slate-300 transition-colors leading-none">
                      <X size={11} />
                    </button>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-2 -mr-1"
            >
              <X size={22} />
            </button>
          </div>

          {!selectedName ? (
            /* Name picker */
            <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6">
              <p className="text-slate-300 text-sm font-semibold text-center mb-6">
                Who are you?
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <div>
                  <p className="text-east-light text-xs font-semibold uppercase tracking-widest mb-3">
                    Team East
                  </p>
                  <div className="space-y-2">
                    {EAST_PLAYERS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => selectPlayer(p.name, p.team)}
                        className="w-full text-left px-3 py-2.5 bg-east/10 hover:bg-east/25 active:bg-east/30 border border-east/20 hover:border-east/50 rounded-xl text-white text-sm font-medium transition-colors"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-west-light text-xs font-semibold uppercase tracking-widest mb-3">
                    Team West
                  </p>
                  <div className="space-y-2">
                    {WEST_PLAYERS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => selectPlayer(p.name, p.team)}
                        className="w-full text-left px-3 py-2.5 bg-west/10 hover:bg-west/25 active:bg-west/30 border border-west/20 hover:border-west/50 rounded-xl text-white text-sm font-medium transition-colors"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto min-h-0 px-4 py-3 space-y-3">
                {messages.length === 0 && (
                  <p className="text-slate-600 text-sm text-center mt-10 italic">
                    No messages yet. Say something!
                  </p>
                )}
                {messages.map((msg) => {
                  const isOwn = msg.name === selectedName;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col gap-0.5 group ${isOwn ? 'items-end' : 'items-start'}`}
                    >
                      {!isOwn && (
                        <span className={`text-xs font-semibold px-1 ${msg.team === 'east' ? 'text-east-light' : 'text-west-light'}`}>
                          {msg.name}
                        </span>
                      )}
                      <div className={`flex items-end gap-1.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <p
                          className={`max-w-[72vw] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                            isOwn
                              ? msg.team === 'east'
                                ? 'bg-east text-white rounded-br-sm'
                                : 'bg-west text-white rounded-br-sm'
                              : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                          }`}
                        >
                          {msg.message}
                        </p>
                        {isOwn && (
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0 pb-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <span className="text-slate-600 text-xs px-1">{formatTime(msg.timestamp)}</span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input — font-size 16px prevents iOS zoom */}
              <div className="shrink-0 px-4 py-3 border-t border-slate-800 bg-slate-950">
                <div className="flex items-end gap-2">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={`Message as ${selectedName}…`}
                    rows={1}
                    style={{ fontSize: 16, maxHeight: 120 }}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:border-gold/50 leading-snug"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="bg-gold hover:bg-gold/90 disabled:opacity-40 text-navy-900 rounded-2xl p-3 transition-all shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
