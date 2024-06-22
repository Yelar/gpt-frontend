'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useWebSocket from '@/lib/hooks/useWebsocket';
import { useEffect, useState } from 'react';
import Roadmap from '@/components/roadmap';
import axios from 'axios';
import { log } from 'console';

export default function Home() {
  const { messages, sendMessage, setMessages } = useWebSocket('ws://localhost:8080');
  const [prompt, setPrompt] = useState('');

  const handleSend = async () => {
    
    if (prompt.trim() !== '') {
      let tmp = messages;
      tmp.push("User: " + prompt);
      tmp.push("Assistant: ");
      setMessages(tmp);
      let conversation = "Here is the previous conversation: ";
      for (let i = 0; i < messages.length - 1; i++) {
        conversation += messages[i];
        conversation += "\n";
      }
      conversation += `Keep in mind context. Answer to this:\n###\n ${prompt}.`
      sendMessage(conversation);
      try {
        const response = await axios.post(`http://gpt-backend-dgfn.onrender.com/api/v1/addMessage`, {
          message: "User: " + prompt,
        });
        console.log('Message posted successfully:', response.data);
      } catch (error) {
        console.error('Failed to post message:', error);
      }

      setPrompt('');
      
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<any[]>(`http://gpt-backend-dgfn.onrender.com/api/v1/getMessages`);
        let tmp = [];
        for (let i = 0; i < response.data.length; i++) {
          tmp.push(response.data[i].message);
        }
        setMessages(tmp);
      } catch (error) {
        console.error('Failed to fetch messages:', error);  // Error handling
      }
    };
  
    fetchData(); 
  }, []); 
  useEffect(() => { 
    console.log(messages);
  }, [messages]);

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header className="bg-primary text-primary-foreground py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold">ChatGPT clone</h1>
      </header>
      <main className="flex-1 py-12 px-4 md:px-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Enter Prompt</h2>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <Button
              onClick={handleSend}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Send
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          <div className="space-y-2">
            {messages.map((message, index) => (
              <Roadmap
                key={index}
                message={message}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
