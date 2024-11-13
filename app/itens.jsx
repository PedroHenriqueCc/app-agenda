import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated, PanResponder, TextInput, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const itens = () => {
  const [itens, setItens] = useState([]);
  const [nota, setNota] = useState('');
  const [prioridade, setPrioridade] = useState('verde');
  const [categoria, setCategoria] = useState('');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState('');
  const [deleteVisible, setDeleteVisible] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const panValues = useRef([]);

  const loadNotas = async () => {
    try {
      const storedNotas = await AsyncStorage.getItem('notas');
      const parsedNotas = storedNotas ? JSON.parse(storedNotas) : [];
      setItens(parsedNotas); 
    } catch (error) {
      alert('Erro ao carregar notas');
    }
  };

  const saveNotas = async (updatedNotas) => {
    try {
      await AsyncStorage.setItem('notas', JSON.stringify(updatedNotas));
      setItens(updatedNotas);
    } catch (error) {
      alert('Erro ao salvar notas');
    }
  };

  const adicionarNota = () => {
    if (nota.trim() && categoria.trim() && quantidadeEstoque.trim()) {
      const novaNota = { id: Date.now(), texto: nota, prioridade, categoria, quantidadeEstoque };
      const updatedNotas = [...itens, novaNota];
      setNota('');
      setCategoria('');
      setQuantidadeEstoque('');
      setMostrarForm(false);
      saveNotas(updatedNotas); 
    }
  };

  const handlePanResponderMove = (index, e, gestureState) => {
    panValues.current[index].setValue(gestureState.dx);
  };

  const handlePanResponderRelease = (index, gestureState) => {
    const newDeleteVisible = [...deleteVisible];
    if (gestureState.dx < -80) {
      newDeleteVisible[index] = true;
    } else if (gestureState.dx > 80) {
      newDeleteVisible[index] = false;
      setEditingNote(index);
      setEditedText(itens[index].texto);
    } else {
      newDeleteVisible[index] = false;
    }
    setDeleteVisible(newDeleteVisible);

    Animated.spring(panValues.current[index], {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const saveEditedNote = async (index) => {
    const updatedItens = [...itens];
    updatedItens[index].texto = editedText;
    saveNotas(updatedItens);  
    setEditingNote(null);
  };

  const deleteNote = async (index) => {
    const updatedItens = [...itens];
    updatedItens.splice(index, 1);
    saveNotas(updatedItens);  
  };

  useEffect(() => {
    loadNotas();
  }, []);

  const itensFiltrados = filtroCategoria
    ? itens.filter(item => item.categoria.toLowerCase().includes(filtroCategoria.toLowerCase()))
    : itens;

  const ordenarItensPorPrioridade = (itens) => {
    const prioridadeOrder = {
      vermelho: 1,
      amarelo: 2,
      verde: 3
    };
    
    return itens.sort((a, b) => prioridadeOrder[a.prioridade] - prioridadeOrder[b.prioridade]);
  };

  const renderItem = ({ item, index }) => {
    if (!panValues.current[index]) {
      panValues.current[index] = new Animated.Value(0);
    }

    return (
      <View key={index} style={styles.itemContainer}>
        <Animated.View
          {...PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => handlePanResponderMove(index, e, gestureState),
            onPanResponderRelease: (e, gestureState) => handlePanResponderRelease(index, gestureState),
          }).panHandlers}
          style={[styles.item, { backgroundColor: getCorPrioridade(item.prioridade), transform: [{ translateX: panValues.current[index] }] }]}
        >
          {editingNote === index ? (
            <TextInput
              style={styles.input}
              value={editedText}
              onChangeText={setEditedText}
              multiline
            />
          ) : (
            <>
              <Text style={styles.itemText}>{item.texto}</Text>
              <Text style={styles.categoriaText}>Categoria: {item.categoria}</Text>
              <Text style={styles.estoqueText}>Estoque: {item.quantidadeEstoque}</Text>
            </>
          )}
        </Animated.View>

        {deleteVisible[index] && (
          <View style={styles.deleteArea}>
            <TouchableOpacity onPress={() => deleteNote(index)}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
          </View>
        )}

        {editingNote === index && (
          <View style={styles.saveArea}>
            <TouchableOpacity onPress={() => saveEditedNote(index)}>
              <Icon name="check" size={28} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const getCorPrioridade = (prioridade) => {
    switch (prioridade) {
      case 'vermelho':
        return '#ef4444';
      case 'amarelo':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputFiltro}
        placeholder="Pesquisar por Categoria"
        value={filtroCategoria}
        onChangeText={setFiltroCategoria}
      />

      {!mostrarForm && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setMostrarForm(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      )}

      {mostrarForm && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua nota"
            value={nota}
            onChangeText={setNota}
          />
          <TextInput
            style={styles.input}
            placeholder="Categoria"
            value={categoria}
            onChangeText={setCategoria}
          />
          <TextInput
            style={styles.input}
            placeholder="Quantidade em estoque"
            keyboardType="numeric"
            value={quantidadeEstoque}
            onChangeText={setQuantidadeEstoque}
          />
          <View style={styles.picker}>
            <TouchableOpacity
              style={[styles.botaoPrioridade, { borderColor: prioridade === 'vermelho' ? '#ef4444' : '#ddd' }]}
              onPress={() => setPrioridade('vermelho')}
            >
              <Text style={[styles.textoBotao, { color: '#ef4444' }]}>Alta</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoPrioridade, { borderColor: prioridade === 'amarelo' ? '#f59e0b' : '#ddd' }]}
              onPress={() => setPrioridade('amarelo')}
            >
              <Text style={[styles.textoBotao, { color: '#f59e0b' }]}>Média</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoPrioridade, { borderColor: prioridade === 'verde' ? '#10b981' : '#ddd' }]}
              onPress={() => setPrioridade('verde')}
            >
              <Text style={[styles.textoBotao, { color: '#10b981' }]}>Baixa</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarNota}>
            <Text style={styles.textoBotaoAdicionar}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={ordenarItensPorPrioridade(itensFiltrados)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.lista}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 20,
  },
  addButton: {
    position: 'absolute',
    top: 120, 
    left: '50%',
    marginLeft: -15, 
    backgroundColor: '#3b82f6',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  inputFiltro: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#fff',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 40, 
    width: '100%', 
  }, 
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#fff',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '100%', 
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  botaoPrioridade: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  textoBotao: {
    fontSize: 18,
    fontWeight: '700',
  },
  botaoAdicionar: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  textoBotaoAdicionar: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  lista: {
    marginTop: 120,
    paddingTop: 20,
  },
  itemContainer: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  item: {
    padding: 18,
    borderRadius: 12,
  },
  itemText: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 8,
  },
  categoriaText: {
    fontSize: 16,
    color: '#222222',
    fontWeight: '500',
  },
  estoqueText: {
    fontSize: 16,
    color: '#222222',
    fontWeight: '500',
  },
  deleteArea: {
    position: 'absolute',
    right: 15,
    top: '40%',
    transform: [{ translateY: -10 }],
    backgroundColor: '#ef4444',
    borderRadius: 30,
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  saveArea: {
    position: 'absolute',
    right: 60,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  saveText: {
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: 22,
  },
});

export default itens;
