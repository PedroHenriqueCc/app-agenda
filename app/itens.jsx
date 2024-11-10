import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const itens = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Itens</Text>
      {/* Aqui você pode adicionar mais conteúdo para a página de itens */}
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

export default itens;
