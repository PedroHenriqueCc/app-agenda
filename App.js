import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import index from './index';  
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
          options={{ headerShown: false  }}
        />
        <Stack.Screen
          name="itens"
          component={itens}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="funcionarios"
          component={funcionarios}
          options={{ headerShown: false  }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
