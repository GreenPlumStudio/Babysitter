import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export const ReminderCell = ({reminder, deleteReminder, i}) => {

  return (
    <View>
      <Text>{reminder.title} - {reminder.text}</Text>
      
      <Button title="X" onPress={() => deleteReminder(i)} />
    </View>
  )
}