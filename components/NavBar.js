import React from 'react';
import { StyleSheet, Text, View, Dimensions,  TouchableOpacity } from 'react-native';

const NavBar = (props) => {
    let currentPage = props.currentPage;

    return (
        <View style={styles.navBar}>
            <TouchableOpacity style={currentPage === "messages" ? styles.navButtonPressed : styles.navButton} onPress={() => {props.changeCurrentPage("messages")}}>
                <Text style={currentPage === "messages" ? styles.navButtonPressedLabel : styles.navButtonLabel}>
                    MESSAGES
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={currentPage === "reminders" ? styles.navButtonPressed : styles.navButton} onPress={() => {props.changeCurrentPage("reminders")}}>
                <Text style={currentPage === "reminders" ? styles.navButtonPressedLabel : styles.navButtonLabel}>
                    REMINDERS
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={currentPage === "babyInfo" ? styles.navButtonPressed : styles.navButton} onPress={() => {props.changeCurrentPage("babyInfo")}}>
                <Text style={currentPage === "babyInfo" ? styles.navButtonPressedLabel : styles.navButtonLabel}>
                    BABY INFO
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        width: Dimensions.get("window").width,
        maxHeight: 30,
        marginBottom: 5,
        elevation: 3,
        zIndex: 0,
        top: 55
    },
  
    navButton: {
        width: Dimensions.get("window").width / 3
    },
  
    navButtonPressed: {
        borderBottomWidth: 2,
        borderBottomColor: "#f8f8ff",
        width: Dimensions.get("window").width / 3
    },
  
    navButtonLabel: {
        color: "#f5f5f5",
        fontWeight: "bold",
        textAlign: "center"
    },
    
    navButtonPressedLabel: {
        color: "#f8f8ff",
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default NavBar;
