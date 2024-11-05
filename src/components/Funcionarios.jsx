import React, { useState } from 'react';
import '../css/funcionarios.css';
import { useGlobalContext } from '../hooks/GlobalContext';

const Funcionarios = () => {
  const { funcionarios, setFuncionarios } = useGlobalContext();
  const [nome, setNome] = useState('');
  const [isAddingFuncionario, setIsAddingFuncionario] = useState(false);
  const [editingFuncionarioIndex, setEditingFuncionarioIndex] = useState(null);

  const xIcon = '/x.png';
  const plusIcon = '/plus.png';
  const pencilIcon = '/pencil.png';

  const handleAddFuncionario = () => {
    if (nome.trim()) {
      setFuncionarios([...funcionarios, nome.trim()]);
      setNome('');
      setIsAddingFuncionario(false);
    }
  };

  const handleDeleteFuncionario = (index) => {
    setFuncionarios(funcionarios.filter((_, i) => i !== index));
  };

  const handleEditFuncionario = (index) => {
    setNome(funcionarios[index]);
    setEditingFuncionarioIndex(index);
  };

  const handleUpdateFuncionario = () => {
    if (nome.trim() && editingFuncionarioIndex !== null) {
      const updatedFuncionarios = [...funcionarios];
      updatedFuncionarios[editingFuncionarioIndex] = nome.trim();
      setFuncionarios(updatedFuncionarios);
      setNome('');
      setEditingFuncionarioIndex(null);
    }
  };

  return (
    <div className="page-container">
      <div className="funcionarios">
        <h2>Funcionários</h2>
        <button className="add-button" onClick={() => setIsAddingFuncionario(!isAddingFuncionario)}>
          <img src={plusIcon} alt="Adicionar Funcionário" className="plus-icon" />
        </button>

        {isAddingFuncionario && (
          <div className="funcionarios-input">
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do funcionário"
            />
            <button className="action-button" onClick={handleAddFuncionario}>
              Adicionar
            </button>
          </div>
        )}

        <ul>
          {funcionarios.map((funcionario, index) => (
            <li key={index}>
              <div className="funcionario-nome">
                {editingFuncionarioIndex === index ? (
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do funcionário"
                  />
                ) : (
                  <span>{funcionario}</span>
                )}
                <div className="funcionario-actions">
                  {editingFuncionarioIndex === index ? (
                    <button className="action-button" onClick={handleUpdateFuncionario}>
                      Salvar
                    </button>
                  ) : (
                    <img
                      src={pencilIcon}
                      alt="Editar"
                      className="edit-icon"
                      onClick={() => handleEditFuncionario(index)}
                    />
                  )}
                  <img
                    src={xIcon}
                    alt="Excluir"
                    className="delete-icon"
                    onClick={() => handleDeleteFuncionario(index)}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Funcionarios;
