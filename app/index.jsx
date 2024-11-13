import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Animated, TextInput, StyleSheet, StatusBar, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment-timezone';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const index = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [notes, setNotes] = useState([]);
  const [deleteVisible, setDeleteVisible] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [notesByDate, setNotesByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [noteTextForDate, setNoteTextForDate] = useState('');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const parsedNotes = storedNotes ? JSON.parse(storedNotes) : [];
      setNotes(Array.isArray(parsedNotes) ? parsedNotes : []);
      updateNotesByDate(parsedNotes);
    } catch (error) {
      alert('Erro ao carregar notas');
    }
  };

  const saveNotes = async (updatedNotes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      updateNotesByDate(updatedNotes);
    } catch (error) {
      alert('Erro ao salvar notas');
    }
  };

  const updateNotesByDate = (notes) => {
    const notesGroupedByDate = notes.reduce((acc, note) => {
      if (note.dateTime) {
        const date = note.dateTime.split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(note);
      }
      return acc;
    }, {});
    setNotesByDate(notesGroupedByDate);
  };

  const saveEditedNote = async (index) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = { ...updatedNotes[index], text: editedText };
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    setEditingNote(null);
    setEditedText('');
  };

  const deleteNote = async (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    updateNotesByDate(updatedNotes);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    setDatePickerVisibility(true);
  };

  const handleConfirm = (date) => {
    setSelectedDateTime(date);
    setDatePickerVisibility(false);
  };

  const handleCancel = () => {
    setDatePickerVisibility(false);
  };

  const scheduleNotification = async (noteText, dateTime) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete",
        body: noteText,
        sound: true,
      },
      trigger: new Date(dateTime),
    });
  };

  const addNoteWithDateTime = () => {
    if (!selectedDateTime || !noteTextForDate.trim()) {
      alert('Por favor, adicione uma nota e selecione uma data e hora');
      return;
    }

    const formattedDateTime = selectedDateTime instanceof Date ? selectedDateTime.toISOString() : selectedDateTime;

    const updatedNotes = [
      ...notes,
      { text: noteTextForDate, dateTime: formattedDateTime },
    ];

    scheduleNotification(noteTextForDate, selectedDateTime);

    setNoteTextForDate('');
    setSelectedDateTime(null);
    saveNotes(updatedNotes);
    setSelectedDate('');
  };

  useEffect(() => {
    loadNotes();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    StatusBar.setBackgroundColor('#3b82f6');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.fadeTop}></View>

      <View style={styles.header}>
        <Text style={styles.title}>Agenda</Text>

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
          markedDates={notes.reduce((acc, note) => {
            if (note.dateTime && typeof note.dateTime === 'string') {
              const date = note.dateTime.split('T')[0];
              acc[date] = { selected: true, selectedColor: '#3b82f6' };
            }
            return acc;
          }, {})}
          monthFormat={'MM yyyy'}
          hideExtraDays={true}
          onDayPress={handleDateSelect}
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

      <ScrollView style={styles.noteContainer}>
        <View style={[styles.addNoteWithDateTimeContainer, { marginBottom: 20 }]}>
          <TextInput
            style={styles.input}
            placeholder="Adicione texto para a nota"
            value={noteTextForDate}
            onChangeText={setNoteTextForDate}
          />
          <TouchableOpacity style={styles.addButton} onPress={addNoteWithDateTime}>
            <Text style={styles.addButtonText}>Adicionar Nota com Data e Hora</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notesContainer}>
          {notesByDate[selectedDate] ? (
            notesByDate[selectedDate].map((note, index) => (
              <View key={index} style={styles.noteItem}>
                {editingNote === index ? (
                  <TextInput
                    style={styles.input}
                    value={editedText}
                    onChangeText={setEditedText}
                  />
                ) : (
                  <Text
                    style={styles.noteText}
                    onPress={() => setSelectedNoteIndex(selectedNoteIndex === index ? null : index)} // Toggle note visibility
                  >
                    {note.text}
                  </Text>
                )}

                {selectedNoteIndex === index && ( // Check if the current note is selected
                  <View style={styles.actionsContainer}>
                    {editingNote !== index ? (
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                          setEditingNote(index);
                          setEditedText(note.text);
                        }}
                      >
                        <Icon name="edit" size={20} color="#fff" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => saveEditedNote(index)}
                      >
                        <Icon name="save" size={20} color="#fff" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteNote(index)}
                    >
                      <Text style={styles.deleteText}> X </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noNotesText}>Sem notas para esta data</Text>
          )}
        </View>
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        minimumDate={new Date()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  fadeTop: { height: 40, backgroundColor: '#3b82f6' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#3b82f6' },
  title: { fontSize: 35, fontWeight: 'bold', color: '#fff' },
  iconContainer: { flexDirection: 'row' },
  iconButton: { marginLeft: 10 },
  calendarContainer: { flex: 1 },
  noteContainer: { flex: 1, padding: 20 },
  notesContainer: { flex: 1 },
  noteItem: { marginBottom: 10, borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 10 },
  noteText: { fontSize: 16 },
  actionsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  saveButton: { backgroundColor: '#4CAF50', padding: 5, borderRadius: 10 },
  deleteButton: { backgroundColor: '#f44336', padding: 5, borderRadius: 10 },
  deleteText: { color: '#fff', fontWeight: 'bold' },
  addNoteWithDateTimeContainer: { marginBottom: 20, backgroundColor: '#fff' }, // Ensure this has the correct background color
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 },
  addButton: { backgroundColor: '#3b82f6', padding: 10, borderRadius: 5, marginTop: 10 },
  addButtonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  noNotesText: { textAlign: 'center', color: '#aaa' },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconButton: {
      backgroundColor: '#fff',  
      borderRadius: 50,         
      padding: 10,              
      margin: 10,             
      elevation: 5,         
    },
  });

export default index;
