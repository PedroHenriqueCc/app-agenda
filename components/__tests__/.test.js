import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FuncionarioScreen from './FuncionarioScreen';
import { SnapshotTestRenderer } from 'react-test-renderer';

jest.mock('@react-native-async-storage/async-storage');

describe('FuncionarioScreen', () => {
  it('should add a new funcionario', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<FuncionarioScreen />);
    
    const addButton = getByText('+');
    fireEvent.press(addButton);

    const inputField = getByPlaceholderText('Adicionar novo funcionário');
    fireEvent.changeText(inputField, 'Novo Funcionário');

    const checkButton = getByText('✓');
    fireEvent.press(checkButton);

    await waitFor(() => {
      expect(queryByText('Novo Funcionário')).not.toBeNull();
    });
  });

  it('should delete a funcionario', async () => {
    const { getByText, queryByText } = render(<FuncionarioScreen />);

    const deleteButton = getByText('delete'); 
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(queryByText('Funcionário Exemplo')).toBeNull();
    });
  });

  it('should edit a funcionario name', async () => {
    const { getByText, getByPlaceholderText } = render(<FuncionarioScreen />);
    
    const editButton = getByText('edit');
    fireEvent.press(editButton);

    const inputField = getByPlaceholderText('Editar nome');
    fireEvent.changeText(inputField, 'Novo Nome');

    const saveButton = getByText('✓');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(getByText('Novo Nome')).not.toBeNull();
    });
  });

  it('should match snapshot for FuncionarioScreen', () => {
    const tree = render(<FuncionarioScreen />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import TarefaScreen from './TarefaScreen';

describe('TarefaScreen', () => {
  it('should add a new task', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<TarefaScreen />);
    
    const inputField = getByPlaceholderText('Adicionar nova tarefa');
    fireEvent.changeText(inputField, 'Nova Tarefa');

    const addButton = getByText('+');
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(queryByText('Nova Tarefa')).not.toBeNull();
    });
  });

  it('should delete a task', async () => {
    const { getByText, queryByText } = render(<TarefaScreen />);

    const deleteButton = getByText('delete'); 
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(queryByText('Tarefa Exemplo')).toBeNull();
    });
  });

  it('should match snapshot for TarefaScreen', () => {
    const tree = render(<TarefaScreen />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FuncaoScreen from './FuncaoScreen';

describe('FuncaoScreen', () => {
  it('should add a funcao to funcionario', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<FuncaoScreen />);
    
    const addButton = getByText('plus');
    fireEvent.press(addButton);

    const inputField = getByPlaceholderText('Adicionar função');
    fireEvent.changeText(inputField, 'Nova Função');

    const saveButton = getByText('✓');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(queryByText('Nova Função')).not.toBeNull();
    });
  });

  it('should delete a funcao', async () => {
    const { getByText, queryByText } = render(<FuncaoScreen />);

    const deleteButton = getByText('delete'); 
    fireEvent.press(deleteButton);

    await waitFor(() => {
      expect(queryByText('Função Exemplo')).toBeNull();
    });
  });

  it('should match snapshot for FuncaoScreen', () => {
    const tree = render(<FuncaoScreen />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
