import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  type: 'student' | 'facilitator' | 'system' | 'help-request';
  content: string;
  timestamp: number;
  sender: string;
  userId: string;
}

export function useWebSocketChat(roomId: string, userId: string, userRole: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // For demo purposes, we'll simulate a WebSocket connection
    // In production, you'd connect to your actual WebSocket server
    const connectWebSocket = () => {
      try {
        // Simulating WebSocket connection with mock server
        const mockWs = {
          readyState: WebSocket.OPEN,
          send: (data: string) => {
            console.log('Sending message:', data);
            const message = JSON.parse(data);
            
            // Simulate receiving the message back
            setTimeout(() => {
              const newMessage = {
                ...message,
                id: Date.now().toString(),
                timestamp: Date.now(),
              };
              
              setMessages(prev => [...prev, newMessage]);
            }, 100);
          },
          close: () => {
            setIsConnected(false);
          },
          addEventListener: () => {},
          removeEventListener: () => {},
        } as any;

        wsRef.current = mockWs;
        setIsConnected(true);

        // Load existing messages from localStorage for persistence
        const savedMessages = localStorage.getItem(`chat_${roomId}`);
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }

        return mockWs;
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
        return null;
      }
    };

    const ws = connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [roomId]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${roomId}`, JSON.stringify(messages));
    }
  }, [messages, roomId]);

  const sendMessage = async (
    content: string, 
    type: 'student' | 'facilitator' | 'system' | 'help-request' = userRole as any
  ) => {
    if (!wsRef.current || !isConnected) {
      console.error('WebSocket is not connected');
      return;
    }

    const message = {
      type,
      content,
      sender: userRole,
      userId,
      roomId,
    };

    wsRef.current.send(JSON.stringify(message));
  };

  return { messages, sendMessage, isConnected };
}