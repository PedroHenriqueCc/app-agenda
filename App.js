import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import index from './index'; 
import noteContext from './noteContext'; 
import editNote from './editNote'; 
import itens from './itens';
import funcionarios from './funcionarios'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="index"
          component={index}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="noteContext"
          component={noteContext}
          options={{ title: 'Adicionar Nota' }}
        />
        <Stack.Screen
          name="editNote"
          component={editNote}
          options={{ title: 'Editar Nota' }}
        />
        <Stack.Screen
          name="itens"
          component={itens}
          options={{ title: 'Itens' }}
        />
        <Stack.Screen
          name="funcionarios"
          component={funcionarios}
          options={{ title: 'Funcionarios' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
