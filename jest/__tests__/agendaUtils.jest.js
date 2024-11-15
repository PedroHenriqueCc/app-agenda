import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render } from '@testing-library/react-native'; // If testing a React Native component

// Mocking AsyncStorage and Notifications for testing
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('expo-notifications', () => ({
  scheduleNotificationAsync: jest.fn(),
}));

// Mock data for testing
const notes = [
  { text: 'Note 1', dateTime: '2024-11-15T10:00:00.000Z' },
  { text: 'Note 2', dateTime: '2024-11-16T11:00:00.000Z' },
];

// Define the functions we want to test directly in the test file

const loadNotes = async () => {
  try {
    const storedNotes = await AsyncStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  } catch (error) {
    throw new Error('Error loading notes');
  }
};

const saveNotes = async (updatedNotes) => {
  try {
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
  } catch (error) {
    throw new Error('Error saving notes');
  }
};

const deleteNote = async (index, notes) => {
  try {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    return updatedNotes;
  } catch (error) {
    throw new Error('Error deleting note');
  }
};

const scheduleNotification = async (noteText, dateTime) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder",
      body: noteText,
      sound: true,
    },
    trigger: new Date(dateTime),
  });
};

describe('agendaUtils functions', () => {
  let notes;

  beforeEach(() => {
    notes = [
      { text: 'Note 1', dateTime: '2024-11-15T10:00:00.000Z' },
      { text: 'Note 2', dateTime: '2024-11-16T11:00:00.000Z' },
    ];
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  it('should load notes from AsyncStorage', async () => {
    // Mock AsyncStorage to return a predefined notes array
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(notes));
    const loadedNotes = await loadNotes();
    expect(loadedNotes).toEqual(notes);
  });

  it('should save notes to AsyncStorage', async () => {
    const newNotes = [...notes, { text: 'Note 3', dateTime: '2024-11-17T12:00:00.000Z' }];
    // Mocking AsyncStorage.setItem to resolve without errors
    AsyncStorage.setItem.mockResolvedValueOnce(undefined); // simulate success
    await saveNotes(newNotes);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('notes', JSON.stringify(newNotes));
  });

  it('should delete a note from the notes array', async () => {
    const updatedNotes = await deleteNote(0, notes);
    expect(updatedNotes).toHaveLength(1);
    expect(updatedNotes).not.toContainEqual(notes[0]);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('notes', JSON.stringify(updatedNotes));
  });

  it('should schedule a notification for a note', async () => {
    const noteText = 'Test Note';
    const dateTime = '2024-11-18T14:00:00.000Z';
    await scheduleNotification(noteText, dateTime);
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: "Reminder",
        body: noteText,
        sound: true,
      },
      trigger: new Date(dateTime),
    });
  });

  // Snapshot test for the notes array
  it('should match the snapshot of notes array', () => {
    expect(notes).toMatchSnapshot();
  });
});
