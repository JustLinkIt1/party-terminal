// src/App.tsx
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import styled from 'styled-components';
import './index.css'; // Ensure this is imported to apply global styles

const TerminalContainer = styled.div`
  background-color: #000;
  color: #00ff00;
  font-family: 'VT323', monospace;
  height: 100vh;
  padding: 20px;
  overflow-y: auto;
  text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
`;

const Message = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  color: #00ff00;
  font-size: 18px;
  outline: none;
  font-family: inherit;
  text-shadow: inherit;
`;

function App() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      const userMessage = input.trim();
      setMessages([...messages, { sender: 'You', text: userMessage }]);
      setInput('');

      setIsBotTyping(true); // Show typing indicator

      const botResponse = await getBotResponse(userMessage);

      setIsBotTyping(false); // Hide typing indicator

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'Bot', text: botResponse },
      ]);
    }
  };

  const getBotResponse = async (message: string): Promise<string> => {
    try {
      const response = await fetch('/api/getBotResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error fetching bot response:', errorData.message);
        return "Hmm, I'm having trouble partying right now.";
      }

      const data = await response.json();
      return data.reply || "Hmm, I'm having trouble partying right now.";
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return "Sorry, I'm having trouble connecting to the party.";
    }
  };

  return (
    <TerminalContainer>
      {messages.map((msg, index) => (
        <Message key={index}>
          <strong>{msg.sender}:</strong> {msg.text}
        </Message>
      ))}
      {isBotTyping && (
        <Message>
          <em>Bot is typing...</em>
        </Message>
      )}
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleSend}
        placeholder="Type your message and press Enter..."
        autoFocus
      />
      <div ref={terminalEndRef} />
    </TerminalContainer>
  );
}

export default App;
