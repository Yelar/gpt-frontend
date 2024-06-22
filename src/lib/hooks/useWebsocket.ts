'use client';
import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<string[]>([]);
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const webSocket = new WebSocket(url);

    webSocket.onopen = () => {
      console.log('WebSocket connection opened');
    };
    
    webSocket.onmessage = (event) => {
      const data = event.data;
      const additionalString = ""; // Define the string to append
      
      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1] + data;
        return [...prevMessages.slice(0, -1), lastMessage];
      });
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    webSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    webSocketRef.current = webSocket;

    return () => {
      webSocket.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  };

  return { messages, sendMessage, setMessages };
};

export default useWebSocket;
