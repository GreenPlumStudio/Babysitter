import React, {Component} from 'React';
import { StyleSheet, Text, View, Button } from 'react-native';
import {ReminderCell} from './ReminderCell';
import {firebase, firestore} from '../utils/firebase';



export default class Reminders extends Component {
    constructor(props) {
        super(props);
        
        

        this.state = {
            reminders: this.props.reminders
        };

        console.log(this.props.reminders);

        this.deleteReminder = this.deleteReminder.bind(this);

    };

    deleteReminder(i) {
        let ar = this.state.reminders;
        ar.splice(i, 1);

        if (ar === null || ar === undefined) {
            this.setState({reminders: []});
        }
        else {this.setState({reminders: ar});}

        
        console.log(i);
        console.log(this.state.reminders)

        this.props.DeleteReminder(this.state.reminders);
    }

    render() {
        return (
            <View>
                <Text>Reminders</Text>
                
                {this.state.reminders &&
                    <View>{this.state.reminders.map((reminder, i) => 
                            <ReminderCell reminder={reminder} deleteReminder={this.deleteReminder.bind(this)} i={i}/>
                    )}</View>
                }


                <Button title="Add a Reminder" onPress={this.props.popupDialog} />
                
            </View>
        );
    };

};
