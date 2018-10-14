import React, {Component} from 'React';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import {ReminderCell} from './ReminderCell';
import {firebase, firestore} from '../utils/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Constants} from 'expo';

export default class Reminders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reminders: this.props.reminders
        };

        this.deleteReminder = this.deleteReminder.bind(this);
    };

    deleteReminder(i) {
        let ar = this.state.reminders;
        ar.splice(i, 1);

        if (ar === null || ar === undefined) {
            this.setState({reminders: []});
        }
        else {this.setState({reminders: ar});}

        this.props.deleteReminder(this.state.reminders);
    }

    render() {
        return (
            <View style={{
                height: Dimensions.get('window').height - Constants.statusBarHeight - 85
            }}>
                <Text>Reminders</Text>
                
                {
                    this.state.reminders &&
                    <View>{this.state.reminders.map( (reminder, i) => 
                        <ReminderCell key={i} reminder={reminder} deleteReminder={this.deleteReminder.bind(this)} i={i}/>
                    )}</View>
                }

                {
                    this.props.accountType === "parent" &&

                    <View
                        style={{
                            shadowOpacity: 0.5,
                            position: "absolute",
                            bottom: 22,
                            right: 14,
                            alignItems:'center',
                            justifyContent:'center',
                            width:65,
                            height:65,
                        }}
                    >
                        <Icon  name={"add-circle"} size={65} color="#01a699" onPress={() => this.props.popupDialog()} />
                    </View>
                }
            </View>
        );
    };

};
