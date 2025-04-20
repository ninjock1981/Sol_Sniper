import React, { useState } from 'react';
import useWebSocket from './hooks/useWebSocket';

function App() {
  const { connected, messages, sendMessage } = useWebSocket();
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧠 Sol Sniper WebSocket UI</h1>
      <p>Status: {connected ? '🟢 Povezan' : '🔴 Nije povezan'}</p>

      <div className="my-4">
        <input
          className="border rounded p-2 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Unesi poruku..."
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleSend}
        >
          Pošalji
        </button>
      </div>

      <div className="bg-gray-100 p-3 rounded h-48 overflow-auto">
        <h2 className="font-semibold mb-2">📬 Poruke:</h2>
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm border-b py-1">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
