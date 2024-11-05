import React, { useState, useMemo } from 'react';
import { useGlobalContext } from '../hooks/GlobalContext';
import '../css/itens.css';

const Itens = () => {
  const { itens, setItens } = useGlobalContext();
  const [itemTexto, setItemTexto] = useState('');
  const [prioridadeSelecionada, setPrioridadeSelecionada] = useState('prioridade-alta'); // Prioridade inicial alta
  const [indiceEdicao, setIndiceEdicao] = useState(null);

  const adicionarOuAtualizarItem = () => {
    if (itemTexto.trim()) {
      const novoItem = { texto: itemTexto, prioridade: prioridadeSelecionada };
      const itensAtualizados = indiceEdicao !== null ? [...itens] : [...itens, novoItem];
      if (indiceEdicao !== null) itensAtualizados[indiceEdicao] = novoItem;
      setItens(itensAtualizados);
      reiniciarCampos();
    }
  };

  const itensOrdenados = useMemo(() => {
    const ordemPrioridade = { 'prioridade-alta': 1, 'prioridade-media': 2, 'prioridade-baixa': 3 };
    return [...itens].sort((a, b) => ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade]);
  }, [itens]);

  const reiniciarCampos = () => {
    setItemTexto('');
    setPrioridadeSelecionada('prioridade-alta'); // Reinicia para prioridade alta
    setIndiceEdicao(null);
  };

  // Estilos de cor para prioridades
  const prioridadeCor = {
    'prioridade-alta': { backgroundColor: '#ffe1e1', color: '#d32f2f' },
    'prioridade-media': { backgroundColor: '#fff4cc', color: '#b28704' },
    'prioridade-baixa': { backgroundColor: '#d4f8e8', color: '#2e7d32' }
  };

  return (
    <div className="page-container">
      <div className="itens-container">
        <h2>Gerenciador de Itens</h2>
        <div className="entrada-itens">
          <input
            type="text"
            value={itemTexto}
            onChange={(e) => setItemTexto(e.target.value)}
            placeholder="Novo item"
          />
          <select value={prioridadeSelecionada} onChange={(e) => setPrioridadeSelecionada(e.target.value)}>
            <option value="prioridade-alta">Alta</option>
            <option value="prioridade-media">Média</option>
            <option value="prioridade-baixa">Baixa</option>
          </select>
          <button className="add-button" onClick={adicionarOuAtualizarItem}>
            {indiceEdicao !== null ? 'Salvar' : '+'}
          </button>
        </div>

        <ul className="lista-itens">
          {itensOrdenados.map((item, index) => (
            <li 
              key={index} 
              className="item"
              style={prioridadeCor[item.prioridade]} // Aplica o estilo inline
            >
              {item.texto}
              <div className="acoes">
                <button className="edit-button" onClick={() => {
                  setItemTexto(item.texto);
                  setPrioridadeSelecionada(item.prioridade);
                  setIndiceEdicao(index);
                }}>Editar</button>
                {indiceEdicao === index && (
                  <button className="delete-button" onClick={() => setItens(itens.filter((_, i) => i !== index))}>
                    Excluir
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Itens;
