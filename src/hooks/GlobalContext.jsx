// src/hooks/GlobalContext.jsx
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from './useLocalStorage';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    // Usando useLocalStorage para gerenciar funcionários, itens e funções
    const [funcionarios, setFuncionarios] = useLocalStorage('funcionarios', []);
    const [itens, setItens] = useLocalStorage('itens', []);
    const [funcoes, setFuncoes] = useLocalStorage('funcoes', {}); // Novo estado para as funções dos funcionários

    return (
        <GlobalContext.Provider value={{ funcionarios, setFuncionarios, itens, setItens, funcoes, setFuncoes }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);
