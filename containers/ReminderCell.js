import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';

export const ReminderCell = ({reminder, deleteReminder, i}) => {

  return (
    <View>
      <Text>{reminder.title} - {reminder.text}</Text>
      
      <Button title="X" onPress={() => {
        Alert.alert(
          'Confirmation',
          'Are you sure you want to delete this reminder?',
          [
              {text: 'Cancel'},
              {text: 'Yes', onPress: () => {
                deleteReminder(i);
              }},
            
          ],
        )
      }} />
    </View>
  )
}