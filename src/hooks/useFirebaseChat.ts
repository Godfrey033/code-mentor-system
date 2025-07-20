import { useState, useEffect } from 'react';
import { database } from '@/lib/firebase';
import { ref, push, onValue, off } from 'firebase/database';

interface Message {
  id: string;
  type: 'student' | 'facilitator' | 'system' | 'help-request';
  content: string;
  timestamp: number;
  sender: string;
  userId: string;
}

export function useFirebaseChat(roomId: string, userId: string, userRole: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const messagesRef = ref(database, `chats/${roomId}/messages`);
    
    const handleValueChange = (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value,
        }));
        setMessages(messageList.sort((a, b) => a.timestamp - b.timestamp));
      } else {
        setMessages([]);
      }
    };

    onValue(messagesRef, handleValueChange);

    return () => {
      off(messagesRef, 'value', handleValueChange);
    };
  }, [roomId]);

  const sendMessage = async (content: string, type: 'student' | 'facilitator' | 'system' | 'help-request' = userRole as any) => {
    const messagesRef = ref(database, `chats/${roomId}/messages`);
    const newMessage = {
      type,
      content,
      timestamp: Date.now(),
      sender: userRole,
      userId,
    };
    
    await push(messagesRef, newMessage);
  };

  return { messages, sendMessage };
}