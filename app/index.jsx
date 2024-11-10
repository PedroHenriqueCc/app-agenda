import React, { useEffect, useState, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated, PanResponder, TextInput, StyleSheet, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/AntDesign';

const index = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [notes, setNotes] = useState([]);
  const [deleteVisible, setDeleteVisible] = useState([]);
  const [editingNote, setEditingNote] = useState(null); // Controla qual nota está sendo editada
  const [editedText, setEditedText] = useState('');
  const panValues = useRef([]);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      setNotes(storedNotes ? JSON.parse(storedNotes) : []);
    } catch (error) {
      alert('Erro ao carregar notas');
    }
  };

  const saveEditedNote = async (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = editedText;
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    setEditingNote(null); // Finaliza a edição
  };

  const deleteNote = async (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const handlePanResponderMove = (index, e, gestureState) => {
    panValues.current[index].setValue(gestureState.dx);
  };

  const handlePanResponderRelease = (index, gestureState) => {
    const newDeleteVisible = [...deleteVisible];
    const newEditVisible = [...deleteVisible];  // Removido o botão de editar

    // Exibir o ícone de excluir se o arraste for para a esquerda
    if (gestureState.dx < -80) {
      newDeleteVisible[index] = true;
    } 
    // Entrar no modo de edição automaticamente ao arrastar para a direita
    else if (gestureState.dx > 80) {
      newDeleteVisible[index] = false;  // Esconde o ícone de excluir
      setEditingNote(index); // Ativa o modo de edição
      setEditedText(notes[index]); // Carrega o conteúdo da nota para edição
    } else {
      newDeleteVisible[index] = false;
    }

    setDeleteVisible(newDeleteVisible);

    Animated.spring(panValues.current[index], {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="transparent" />
      <View style={styles.fadeTop}></View>

      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('noteContext')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        
        {/* Adicionando os botões de Funcionários e Itens */}
        <View style={styles.iconContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('itens')}
          >
            <Icon name="dropbox" size={30} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('funcionarios')}
          >
            <Icon name="user" size={30} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={{
            [new Date().toISOString().split('T')[0]]: { selected: true, selectedColor: '#3b82f6' },
          }}
          monthFormat={'MM yyyy'}
          hideExtraDays={true}
          theme={{
            selectedDayBackgroundColor: '#3b82f6',
            selectedDayTextColor: '#fff',
            todayTextColor: '#3b82f6',
            dayTextColor: '#6b7280',
            monthTextColor: '#1f2937',
            arrowColor: '#3b82f6',
          }}
        />
      </View>

      <Animated.View style={[styles.noteContainer, { opacity: fadeAnim }]}>
        {notes.length > 0 ? (
          notes.map((note, index) => {
            if (!panValues.current[index]) {
              panValues.current[index] = new Animated.Value(0);
            }

            return (
              <View key={index} style={styles.noteBox}>
                <Animated.View
                  {...PanResponder.create({
                    onStartShouldSetPanResponder: () => true,
                    onPanResponderMove: (e, gestureState) => handlePanResponderMove(index, e, gestureState),
                    onPanResponderRelease: (e, gestureState) => handlePanResponderRelease(index, gestureState),
                  }).panHandlers}
                  style={[styles.noteContent, { transform: [{ translateX: panValues.current[index] }] }]}
                >
                  {editingNote === index ? (
                    <TextInput
                      style={styles.noteTextInput}
                      value={editedText}
                      onChangeText={setEditedText}
                      multiline
                    />
                  ) : (
                    <Text style={styles.noteText}>{note}</Text>
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
                      <Icon name="check" size={30} color="#000" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>Crie sua primeira nota no +</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 1,
    justifyContent: 'space-between', // Alinha a título e botões na linha
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1f2937',
  },
  addButton: {
    marginLeft: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Alinha os botões ao final
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 50,
    padding: 12,
    marginLeft: 10, // Espaço entre os botões
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 55,
  },
  iconStyle: {
    fontSize: 30,
    color: '#fff',
  },
  calendarContainer: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  arrowText: {
    fontSize: 20,
    color: '#3b82f6',
  },
  noteContainer: {
    marginBottom: 60,
  },
  noteBox: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  noteContent: {
    padding: 15,
  },
  noteText: {
    fontSize: 16,
    color: '#1f2937',
  },
  deleteArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ef4444', // Cor de fundo do ícone de excluir
    height: '100%',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 30,
    color: '#fff',
  },
  editArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#ffcc00', // Cor de fundo do ícone de editar
    borderRadius: 10,
    height: '100%',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#34D399', // Cor de fundo para o ícone de salvar (check)
    borderRadius: 10,
    height: '100%',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default index;
