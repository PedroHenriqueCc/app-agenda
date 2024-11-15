import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Funcionarios = () => {
    const [funcionarios, setFuncionarios] = useState([]);
    const [newFuncionario, setNewFuncionario] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editedText, setEditedText] = useState('');
    const [showFuncaoInput, setShowFuncaoInput] = useState(null);
    const [funcaoEditada, setfuncaoEditada] = useState('');
    const [selectedPriority, setSelectedPriority] = useState('green');
    const [showFuncoes, setShowFuncoes] = useState({});
    const [editDeleteVisibility, setEditDeleteVisibility] = useState({});

    useEffect(() => {
      loadFuncionarios();
    }, []);
  
    const loadFuncionarios = async () => {
      try {
        const storedFuncionarios = await AsyncStorage.getItem('funcionarios');
        if (storedFuncionarios) {
          setFuncionarios(JSON.parse(storedFuncionarios));
        }
      } catch (error) {
        console.error('Erro ao carregar os funcionários', error);
      }
    };
  
    const saveFuncionarios = async (updatedFuncionarios) => {
      try {
        await AsyncStorage.setItem('funcionarios', JSON.stringify(updatedFuncionarios));
        setFuncionarios(updatedFuncionarios);
      } catch (error) {
        console.error('Erro ao salvar os funcionários', error);
      }
    };

    const handleAddButtonPress = () => {
      if (isAdding && newFuncionario.trim()) {
        const updatedFuncionarios = [...funcionarios, { nome: newFuncionario }];
        setNewFuncionario('');
        saveFuncionarios(updatedFuncionarios);
      }
      setIsAdding(!isAdding);
    };

    const handleSaveFuncao = (index) => {
      const updatedFuncionarios = [...funcionarios];
      if (!updatedFuncionarios[index].funcoes) {
        updatedFuncionarios[index].funcoes = [];
      }
      updatedFuncionarios[index].funcoes.push({ funcao: funcaoEditada, prioridade: selectedPriority });
      saveFuncionarios(updatedFuncionarios);
      setShowFuncaoInput(null);
    };

    const handleDeleteFuncao = (index, funcaoIndex) => {
      const updatedFuncionarios = [...funcionarios];
      updatedFuncionarios[index].funcoes.splice(funcaoIndex, 1);
      saveFuncionarios(updatedFuncionarios);
    };

    const handleEditFuncionario = (index) => {
      setEditedText(funcionarios[index].nome);
      const updatedFuncionarios = [...funcionarios];
      updatedFuncionarios[index].isEditing = true;
      setFuncionarios(updatedFuncionarios);
    };

    const saveEditedFuncionario = (index) => {
      const updatedFuncionarios = [...funcionarios];
      updatedFuncionarios[index].nome = editedText;
      updatedFuncionarios[index].isEditing = false;
      setEditedText('');
      saveFuncionarios(updatedFuncionarios);
    };

    const deleteFuncionario = (index) => {
      const updatedFuncionarios = [...funcionarios];
      updatedFuncionarios.splice(index, 1);
      saveFuncionarios(updatedFuncionarios);
    };

    const toggleFuncoesVisibility = (index) => {
      setShowFuncoes(prevState => ({
        ...prevState,
        [index]: !prevState[index],
      }));
    };

    const toggleEditDeleteVisibility = (index) => {
      setEditDeleteVisibility(prevState => ({
        ...prevState,
        [index]: !prevState[index],
      }));
      toggleFuncoesVisibility(index);
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddButtonPress}>
          <Icon name={isAdding ? "check" : "plus"} size={24} color="#fff" />
        </TouchableOpacity>
  
        {isAdding && (
          <TextInput
            style={styles.input}
            placeholder="Adicionar novo funcionário"
            value={newFuncionario}
            onChangeText={setNewFuncionario}
            autoFocus
          />
        )}
  
        {funcionarios.map((funcionario, index) => (
          <View key={index} style={styles.funcionarioContainer}>
            <View style={styles.funcionarioContent}>
              {funcionario.isEditing ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={editedText}
                    onChangeText={setEditedText}
                    placeholder="Editar nome"
                    autoFocus
                  />
                  <TouchableOpacity onPress={() => saveEditedFuncionario(index)} style={styles.checkButton}>
                    <Icon name="check" size={24} color="#10b981" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={() => toggleEditDeleteVisibility(index)}>
                  <Text style={styles.funcionarioName}>{funcionario.nome}</Text>
                </TouchableOpacity>
              )}
  
              {editDeleteVisibility[index] && !funcionario.isEditing && (
                <View style={styles.editDeleteButtons}>
                  <TouchableOpacity onPress={() => handleEditFuncionario(index)}>
                    <Icon name="edit" size={20} color="#f59e0b" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteFuncionario(index)}>
                    <Icon name="delete" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              )}
  
              <TouchableOpacity
                style={styles.addFuncaoButton}
                onPress={() => setShowFuncaoInput(index === showFuncaoInput ? null : index)}
              >
                <Icon name="plus" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
  
            {showFuncaoInput === index && (
              <View style={styles.funcaoContainer}>
                <TextInput
                  style={styles.inputFuncao}
                  placeholder="Adicionar função"
                  value={funcaoEditada}
                  onChangeText={setfuncaoEditada}
                />
                <Picker
                  selectedValue={selectedPriority}
                  style={styles.picker}
                  onValueChange={(itemValue) => setSelectedPriority(itemValue)}
                >
                  <Picker.Item label="Baixa" value="green" />
                  <Picker.Item label="Média" value="yellow" />
                  <Picker.Item label="Alta" value="red" />
                </Picker>
                <TouchableOpacity onPress={() => handleSaveFuncao(index)}>
                  <Icon name="check" size={30} color="#10b981" />
                </TouchableOpacity>
              </View>
            )}

            {showFuncoes[index] && funcionario.funcoes && funcionario.funcoes.length > 0 && (
              <View style={styles.funcaoContainer}>
                {funcionario.funcoes.sort((a, b) => {
                  const priorityOrder = { red: 0, yellow: 1, green: 2 };
                  return priorityOrder[a.prioridade] - priorityOrder[b.prioridade];
                }).map((funcao, funcaoIndex) => (
                  <View key={funcaoIndex} style={[styles.funcaoRow, { backgroundColor: funcao.prioridade === 'red' ? '#ef4444' : funcao.prioridade === 'yellow' ? '#f59e0b' : '#10b981' }]}>
                    <Text style={styles.funcaoText}>{funcao.funcao}</Text>
                    <TouchableOpacity
                      onPress={() => handleDeleteFuncao(index, funcaoIndex)}
                      style={styles.editDeleteButton}
                    >
                      <Icon name="delete" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  input: {
    height: 60, // Increased height for better touch area
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 16,
    marginBottom: 20, // Increased bottom margin for spacing
    fontSize: 22, // Increased font size
    backgroundColor: '#ffffff',
  },
  picker: {
    width: '100%',
    height: 60, // Increased height
    marginTop: 12, // Added space above picker
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 12,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 50,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    width: 55,
    height: 55,
    alignSelf: 'center',
  },
  funcionarioContainer: {
    backgroundColor: '#ffffff',
    padding: 20, // Increased padding for a spacious feel
    marginBottom: 20, // Increased space between items
    borderRadius: 20, // Rounded corners
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  funcionarioContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  funcionarioName: {
    fontSize: 24, // Increased font size for names
    fontWeight: '700', // Bolder font
    color: '#1f2937',
  },
  inputFuncao: {
    height: 50, // Increased height for better input area
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 14,
    marginTop: 15, // Increased space between input and other elements
    fontSize: 22, // Increased font size
    backgroundColor: '#ffffff',
  },
  funcaoText: {
    fontSize: 20, // Increased font size for readability
    color: '#333',
    marginVertical: 10, // Added vertical margin for spacing
  },
  saveButton: {
    marginLeft: 12,
    backgroundColor: '#10b981',
    borderRadius: 50,
    padding: 14, // Increased padding for better touch area
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  editButton: {
    marginLeft: 12,
    backgroundColor: '#f59e0b',
    borderRadius: 50,
    padding: 14, // Increased padding for better touch area
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  deleteButton: {
      backgroundColor: '#ef4444',
      borderRadius: 50,
      padding: 10, // Increased padding
      justifyContent: 'center',
      alignItems: 'center',
  },
  editInput: {
    fontSize: 22, // Increased font size for editing
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    marginRight: 12, // Increased spacing for better layout
  },
  checkButton: {
      position: 'absolute',
      right: 12,
      top: 12,
      zIndex: 1,
  },
  funcaoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10, // Added more spacing between rows
    padding: 10, // Added padding for spacing inside the row
    borderRadius: 15, // Rounded the background
  },
  funcaoText: {
    flex: 1,
    fontSize: 18, // Increased font size for function text
    color: '#333',
    marginVertical: 5,
  },
  editDeleteButton: {
    paddingHorizontal: 10,
    marginLeft: 8, 
  },
  pastelGreen: {
    backgroundColor: '#a8e6cf', // Pastel green
  },
  pastelYellow: {
    backgroundColor: '#f8e47f', // Pastel yellow
  },
  pastelRed: {
    backgroundColor: '#f8a7a7', // Pastel red
  },
  addFuncaoButton: {
      marginLeft: 12,
      backgroundColor: '#7bbaff',
      borderRadius: 50,
      width: 35,
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
  },
  addFuncaoButtonIcon: {
      color: '#ffffff',
      fontSize: 30,
  },
  editDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Funcionarios;