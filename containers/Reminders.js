import React, { Component } from 'React';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import ReminderCell from './ReminderCell';
import Icon from 'react-native-vector-icons/Feather';
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
                    <ScrollView contentContainerStyle={{flexDirection: "column-reverse", padding: 10}}>
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
                        <Icon name={"plus"} style={{
                            position: "absolute",
                            elevation:13
                        }} size={28} color="white" />

                        <View style={{
                            backgroundColor: "cornflowerblue",
                            borderRadius: 27.5,
                            elevation: 6,
                            width: 50,
                            height: 50,
                            position: "absolute",
                            zIndex: 1,
                            overflow: "visible"
                        }} />
                        
                    </TouchableOpacity>
                }
            </View>
        );
    };
};

const styles = StyleSheet.create({
    addReminderIcon: {
        position: "absolute",
        bottom: 15,
        right: 9,
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: 70,
        zIndex: 1
    }
});
