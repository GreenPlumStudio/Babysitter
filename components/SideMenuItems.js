import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';




const SideMenuItems = (props) => {
    return (
        <View style={{flex: 1, alignItems: "center"}}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text>Changes you make will automatically reload.</Text>
            <Text>Shake your phone to open the developer menu.</Text>
            
            <TouchableOpacity style={styles.button} onPress={props.signOut}>
                <Text style={styles.buttonText}>
                    SIGN OUT
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={props.openPopupDialog}>
                <Text style={styles.buttonText}>
                    Add a Babysitter
                </Text>
            </TouchableOpacity>
        </View>
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
    }
});

export default SideMenuItems;
