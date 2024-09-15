import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const CalculatorScreen = () => {
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [operator, setOperator] = useState('add');
  const [result, setResult] = useState('');

  const handleCalculate = async () => {
    if (!num1 || !num2) {
      Alert.alert('Input Error', 'Please enter both numbers');
      return;
    }

    try {
      const response = await axios.post('https://obscure-lowlands-03250-c624aea42f0e.herokuapp.com/calculate', {
        num1: Number(num1),
        num2: Number(num2),
        operator,
      });
      setResult(response.data.result.toString());
    } catch (error) {
      console.error(error);
      setResult('Error occurred');
      Alert.alert('Error', 'Failed to calculate. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter first number"
        keyboardType="numeric"
        value={num1}
        onChangeText={setNum1}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter second number"
        keyboardType="numeric"
        value={num2}
        onChangeText={setNum2}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={operator}
          onValueChange={(itemValue) => setOperator(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Addition" value="add" />
          <Picker.Item label="Subtraction" value="subtract" />
          <Picker.Item label="Multiplication" value="multiply" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>
      {result !== '' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Result: {result}</Text>
        </View>
      )}
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
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f4fd',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default CalculatorScreen;