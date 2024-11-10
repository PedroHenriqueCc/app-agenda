import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const noteContext = () => {
  const [note, setNote] = useState('');

  const handleSaveNote = async () => {
    if (note.trim()) {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        const notes = storedNotes ? JSON.parse(storedNotes) : [];
        const updatedNotes = [...notes, note];

        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
        setNote('');
        alert('Nota salva!');
      } catch (error) {
        alert('Erro ao salvar a nota.');
      }
    } else {
      alert('Por favor, insira uma nota.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Nota</Text>
      
      <TextInput
        style={styles.textInput}
        placeholder="Digite sua nota aqui..."
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
        <Text style={styles.buttonText}>Salvar Nota</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  textInput: {
    width: '100%',
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default noteContext;