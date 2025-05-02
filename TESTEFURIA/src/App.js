import React, { useState, useEffect } from 'react';
import './App.css';
import furiaLogo from './assets/logo-furia.svg';
import axios from 'axios';

function App() {
  console.log('Chave carregada:', process.env.REACT_APP_CHATGPT_KEY);
  const [answer, setAnswer] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const isFuriaRelatedQuestion = (text) => {
    const furiaKeywords = ['furia', 'furiagaming', 'furia esports', 'time furia', 'jogadores furia', 
                           'kscerato', 'csgo furia', 'valorant furia', 'lol furia', 'league of legends furia', 
                           'r6 furia', 'rainbow six furia', 'free fire furia', 'fifa furia', 'apex furia',
                           'kscerato', 'yuurih', 'fallen', 'art', 'vini', 'drop', 'saffee', 'guerri'];
    
    const lowerText = text.toLowerCase();
    return furiaKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;
  
    if (!isFuriaRelatedQuestion(prompt)) {
      setError('Por favor, faça apenas perguntas relacionadas à FURIA e-sports!');
      return;
    }
  
    setIsLoading(true);
    setError(null);
  
    try {
      const result = await axios.post("https://furia-backend-dkj3.onrender.com/api/chat", { prompt });
      setAnswer(result.data.message);
    } catch (err) {
      console.error('Erro ao chamar a API:', err.response ? err.response.data : err.message);
      setError('Erro ao processar sua solicitação. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSendPrompt();
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };


  const handleQuickMessageClick = (message) => {
    setPrompt(message);

    setTimeout(() => handleSendPrompt(), 100);
  };


  const quickMessages = [
    "Quem são os jogadores atuais de CS:GO da FURIA?",
    "Quais as conquistas recentes da FURIA?",
    "Quando é o próximo jogo da FURIA?",
    "Conte sobre a história da FURIA",
    "Quem é o capitão da FURIA?"
  ];

  return (
    <div className="app-container">
      <header>
        <h1>FURIA CHAT</h1>
        <img src={furiaLogo} alt='Logo Furia' />
        <nav className='nav-links'>
          <a href="https://furia.gg" target="_blank" rel="noopener noreferrer">Visite a Loja</a>
          <p>&gt;</p>
          <a href="https://x.com/FURIA?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" target="_blank" rel="noopener noreferrer">Twitter</a>
        </nav>
      </header>
      <div className="App">
        {isLoading && <div className="loading-indicator">Processando...</div>}
        {error && <div className="error-message">{error}</div>}
        <textarea 
          className="answer-box" 
          placeholder="Seja bem vindo ao chat bot da FURIA! Faça uma pergunta no campo abaixo, e estaremos prontos para responder!" 
          id="answer-box" 
          value={answer} 
          readOnly
        />
      
        <div className="quick-messages-container">
          {quickMessages.map((message, index) => (
            <button 
              key={index} 
              className="quick-message-button" 
              onClick={() => handleQuickMessageClick(message)}
              disabled={isLoading}
            >
              {message}
            </button>
          ))}
        </div>
        
        <textarea 
          className="text-box" 
          id="text-box" 
          placeholder="pergunte algo..." 
          value={prompt} 
          onChange={handlePromptChange} 
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button 
          className="send-button" 
          onClick={handleSendPrompt} 
          disabled={isLoading || !prompt.trim()}
        >
          Enviar
        </button>
      </div>
    </div>
  )
}

export default App;