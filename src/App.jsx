import { useEffect, useState } from 'react';
import './App.css';
import gptLogo from './assets/icons/gpt_icon.svg';
import userLogo from './assets/icons/user_icon.svg';

const API_URL = import.meta.env.VITE_API_URL;

const initialMessage = [
  {
    role: 'system',
    content: 'You are a general assistant.',
  },
];

function App() {
  const [messages, setMessages] = useState(initialMessage);
  const [userMessage, setUserMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const setMessage = (msg) => {
    setUserMessage(msg);
  };

  const onKeyEnter = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (userMessage === '') return;
    appendMessage('user', userMessage);
    setUserMessage('');
    setIsSending(true);
  };

  const appendMessage = (role, message) => {
    const newMsg = {
      role: role,
      content: message,
    };

    setMessages([...messages, newMsg]);
  };

  const sendToChatGPT = async () => {
    const data = {
      model: 'gpt-3.5-turbo-1106',
      messages: messages,
      temperature: 0.2,
      maxToken: 256,
    };

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      appendMessage('assistant', result.message.content);
      setIsSending(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSending) {
      sendToChatGPT();
    }
  }, [isSending]);

  return (
    <>
      <div className="chat-container">
        <div className={`${messages.length === 1 ? '' : 'hidden'}`}>
          <img src={gptLogo} className="gpt-icon1" />
          <h2 className="text-center">How can I help you today?</h2>
        </div>

        <div className="chat-messages" id="chatMessages">
          <div className={`${messages.length > 1 ? 'mb-10' : 'hidden'}`}>
            <button
              className="new-chat-btn"
              onClick={() => setMessages(initialMessage)}
            >
              New Chat
            </button>
          </div>

          {/* Messages here ... */}
          {messages.map((message, index) => {
            if (index !== 0) {
              return (
                <div key={index} className="message">
                  <span className="message-owner">
                    {message.role === 'user' ? (
                      <>
                        <img src={userLogo} className="owner-icon" />
                        You
                      </>
                    ) : (
                      <>
                        <img src={gptLogo} className="gpt-icon" />
                        ChatGPT
                      </>
                    )}
                  </span>
                  <p className="text-message">{message.content}</p>
                </div>
              );
            }
          })}
        </div>
        <div className="chat-input">
          <input
            type="text"
            className="input-field"
            id="userMessage"
            placeholder="Message ChatGPT"
            value={userMessage}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => onKeyEnter(e)}
          />
          <button
            className="send-button"
            type="button"
            disabled={isSending || userMessage.length == 0}
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
