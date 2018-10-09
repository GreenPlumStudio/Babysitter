import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';

const SideMenuItems = (props) => {
    return (
        <ScrollView contentContainerStyle={{flex: 1, alignItems: "center", padding: 15}}>
            <Image style={styles.topBarImage} source={require("../assets/sideMenuTopBar.png")} />
            <TouchableOpacity>
                <Image style={styles.userIcon} resizeMode="center" source={require("../assets/defaultUserIcon.png")} />
            </TouchableOpacity>

            <View style={{marginBottom: 10}}>
                <Text style={{fontWeight: "bold", fontSize: 20, textAlign: "center"}}>{props.user.firstName} {props.user.lastName}</Text>
                <Text style={{fontWeight: "500", fontSize: 17, textAlign: "center"}}>{props.username}</Text>
            </View>

            <Text style={{textAlign: "left", fontSize: 17, fontWeight: "400", marginBottom: 7, width: props.sideMenuWidth - 30}}>{props.accountType === "parent" ? "BABYSITTERS" : "PARENTS"}</Text>
            <View>
                {
                    props.oppositeUsers.map( oppositeUser => (
                        <TouchableOpacity style={{width: props.sideMenuWidth - 30, marginBottom: 5}} key={oppositeUser.username} onPress={() => props.switchCurOppositeUser(oppositeUser.username)}>
                            <Text style={{fontSize: 15, fontWeight: "400"}}>{ oppositeUser.firstName + " " + oppositeUser.lastName }</Text>
                            <Text>{ oppositeUser.username + "   |   " + oppositeUser.email }</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>

            <TouchableOpacity style={styles.button} onPress={props.openPopupDialog}>
                <Text style={styles.buttonText}>
                    Add a {props.accountType === "parent" ? "Babysitter" : "Parent"}
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={props.signOut}>
                <Text style={styles.buttonText}>
                    SIGN OUT
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    topBarImage: {
        position: "absolute",
        height: 70
    },

    button: {
        backgroundColor: "#2196F3",
        borderRadius: 2,
        elevation: 4,
        marginTop: 10
    },

    buttonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "500",
        padding: 8
    },

    userIcon: {
        maxHeight: 100,
        maxWidth: 100
    }
});

export default SideMenuItems;
