import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default class ReminderCell extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDeleting: false
        };
    };

    render() {
        return (
            <View style={styles.reminderCell}>
                <View style={styles.reminderInfo}>
                    <Text style={styles.reminderTitle}>{this.props.reminder.title}</Text>
                    <Text style={styles.reminderText}>{this.props.reminder.text}</Text>
                </View>

                <TouchableOpacity style={styles.deleteReminderIcon} onPress={() => {
                    this.setState({isDeleting: true});

                    Alert.alert(
                        "Confirmation",
                        "Are you sure you want to delete this reminder?",
                        [
                            {text: "Cancel"},
                            {
                                text: "Yes",
                                onPress: () => {
                                    this.props.deleteReminder(this.props.i);
                                }
                            }
                        ]
                    );
                    console.log(this.state.isDeleting);
                    this.setState({isDeleting: false});
                }}>
                    <Icon name={this.state.isDeleting ? "delete-empty" : "delete"} size={30}/>
                </TouchableOpacity>
            </View>
        );
    };
};

const styles = StyleSheet.create({
    reminderCell: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        margin: 5,
        elevation: 4,
        backgroundColor: "lightgray",
        borderRadius: 10,
        width: Dimensions.get("window").width - 30
    },

    reminderInfo: {
        padding: 10,
        width: Dimensions.get("window").width - 85
    },

    reminderTitle: {
        fontSize: 20,
        fontWeight: "500"
    },

    reminderText: {
        fontSize: 15
    },
    
    deleteReminderIcon: {
        justifyContent: "center",
        position: "absolute",
        right: 0,
        padding: 10
    }
});
