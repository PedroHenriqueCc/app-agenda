import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/header.css';

export default function Header() {
  const navigate = useNavigate();

  const handleAddNote = () => {
    navigate('/editor');
  };

  const handleNavigateToItems = () => {
    navigate('/itens');
  };

  const handleNavigateToFuncionarios = () => {
    navigate('/funcionarios');
  };

  const handleNavigateToHome = () => {
    navigate('/');
  };

  return (
    <div className='heading-area'>
      <img src="/teeth.png" alt="Ícone de dente" className="teeth-icon" />
      <h2>Agenda</h2>
      
      <div className='icons'>
        <img 
          src="/plus.png" 
          alt="Adicionar Nota"
          className='icon'
          onClick={handleAddNote} 
          style={{ width: '18px', cursor: 'pointer' }}
        />
        <img 
          src="/favicon.png" 
          alt="Itens" 
          className='icon'
          onClick={handleNavigateToItems} 
          style={{ width: '18x', cursor: 'pointer' }}
        />
        <img 
          src="/funcionarios.png" 
          alt="Funcionários" 
          className='icon'
          onClick={handleNavigateToFuncionarios} 
          style={{ width: '218x', cursor: 'pointer' }}
        />
        <img
          src="/home.png"
          alt="Home"
          className='icon'
          onClick={handleNavigateToHome}
          style={{ width: '18px', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
