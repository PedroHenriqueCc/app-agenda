import React, { useState } from 'react';

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [nome, setNome] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const handleAddOrUpdateFuncionario = () => {
    if (editIndex !== null) {
      // Atualiza o funcionário existente
      const updatedFuncionarios = [...funcionarios];
      updatedFuncionarios[editIndex] = nome;
      setFuncionarios(updatedFuncionarios);
      setEditIndex(null);
    } else {
      // Adiciona um novo funcionário
      setFuncionarios([...funcionarios, nome]);
    }
    setNome('');
  };

  const handleEditFuncionario = (index) => {
    setNome(funcionarios[index]);
    setEditIndex(index);
  };

  const handleDeleteFuncionario = (index) => {
    const updatedFuncionarios = funcionarios.filter((_, i) => i !== index);
    setFuncionarios(updatedFuncionarios);
  };

  return (
    <div>
      <h2>Funcionários</h2>
      <input 
        type="text" 
        value={nome} 
        onChange={(e) => setNome(e.target.value)} 
        placeholder="Nome do funcionário" 
      />
      <button onClick={handleAddOrUpdateFuncionario}>
        {editIndex !== null ? 'Atualizar' : 'Adicionar'}
      </button>
      <ul>
        {funcionarios.map((funcionario, index) => (
          <li key={index}>
            {funcionario}
            <button onClick={() => handleEditFuncionario(index)}>Editar</button>
            <button onClick={() => handleDeleteFuncionario(index)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Funcionarios;
