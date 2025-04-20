// hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';

const useWebSocket = () => {
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('✅ WebSocket konektovan');
      setConnected(true);
    };

    socket.onmessage = (event) => {
      console.log('📩 Stigla poruka:', event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    socket.onerror = (error) => {
      console.error('❌ Greška na WebSocket:', error);
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket zatvoren');
      setConnected(false);
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = (msg) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    } else {
      console.warn('⚠️ WebSocket nije konektovan');
    }
  };

  return {
    connected,
    messages,
    sendMessage,
  };
};

export default useWebSocket;
