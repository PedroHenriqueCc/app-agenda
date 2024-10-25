import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
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

  // Nova função para navegar para a página de funcionários
  const handleNavigateToFuncionarios = () => {
    navigate('/funcionarios');
  };

  return (
    <div className='heading-area'>
      <h2>Notes</h2>
      <div className='icons'>
        <SearchIcon className='icon'/>
        <AddIcon className='icon' onClick={handleAddNote}/>
        <img 
          src="/favicon.png" 
          alt="Itens" 
          className='icon'
          onClick={handleNavigateToItems} 
          style={{ width: '24px', cursor: 'pointer' }}
        />
        <img 
          src="/funcionarios.png" 
          alt="Funcionários" 
          className='icon'
          onClick={handleNavigateToFuncionarios} 
          style={{ width: '24px', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
}
