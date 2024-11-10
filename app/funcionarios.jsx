import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const funcionarios = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Funcionários</Text>
      {/* Aqui você pode adicionar mais conteúdo para a página de funcionários */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
  },
});

export default funcionarios;
