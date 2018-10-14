import React, { Component } from 'React';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import ReminderCell from './ReminderCell';
import { firebase, firestore } from '../utils/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Constants } from 'expo';

export default class Reminders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        };

        this.deleteReminder = this.deleteReminder.bind(this);
    };

    deleteReminder(i) {
        let ar = this.props.reminders;
        ar.splice(i, 1);

        if (ar === null || ar === undefined) {
            this.setState({reminders: []});
        }
        else {this.setState({reminders: ar});}

        this.props.deleteReminder(this.props.reminders);
    };

    render() {
        return (
            <View style={{height: Dimensions.get('window').height - Constants.statusBarHeight - 85}}>
                {
                    this.props.reminders.length == 0 &&
                    <View style={{height: Dimensions.get("window").height - Constants.statusBarHeight - 85, justifyContent: "center", alignItems: "center"}}>
                        <Text style={{fontSize: 25, fontWeight: "400"}}>No current reminders!</Text>
                    </View>
                }
                {
                    this.props.reminders &&
                    <ScrollView contentContainerStyle={{padding: 10}}>
                        {
                            this.props.reminders.map( (reminder, i) => 
                                <ReminderCell key={i} reminder={reminder} deleteReminder={this.deleteReminder.bind(this)} i={i} />
                            )
                        }
                    </ScrollView>
                }
                {
                    this.props.accountType === "parent" &&
                    <TouchableOpacity style={styles.addReminderIcon} onPress={() => this.props.popupDialog()}>
                        <Icon name={"add-circle"} size={55} color="#01a699" />
                    </TouchableOpacity>
                }
            </View>
        );
    };
};

const styles = StyleSheet.create({
    addReminderIcon: {
        position: "absolute",
        bottom: 22,
        right: 14,
        alignItems: "center",
        justifyContent: "center",
        width: 65,
        height: 65,
        zIndex: 1,
        elevation: 5
    }
});
