import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';

const SideMenuItems = (props) => {
    return (
        <ScrollView contentContainerStyle={{flex: 1, alignItems: "center", padding: 10}}>
            <TouchableOpacity>
                <Image style={styles.userIcon} resizeMode="center" source={require('../assets/defaultUserIcon.png')} />
            </TouchableOpacity>

            <Text>{props.user.firstName} {props.user.lastName}</Text>

            <Text>{props.username}</Text>
            
            <TouchableOpacity style={styles.button} onPress={props.signOut}>
                <Text style={styles.buttonText}>
                    SIGN OUT
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={props.openPopupDialog}>
                <Text style={styles.buttonText}>
                    Add a {props.accountType === "parent" ? "Babysitter" : "Parent"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#2196F3",
        borderRadius: 2,
        elevation: 4
    },

    buttonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "500",
        padding: 8
    },

    userIcon: {
        maxHeight: 100
    }
});

export default SideMenuItems;
