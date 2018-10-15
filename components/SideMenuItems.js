import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';

const SideMenuItems = (props) => {
    return (
        <ScrollView contentContainerStyle={{flex: 1, alignItems: "center", padding: 15}}>
            <Image style={styles.topBarImage} source={require("../assets/sideMenuTopBar.png")} />
            <TouchableOpacity>
                <Image style={styles.userIcon} resizeMode="center" source={props.accountType === "parent" ? require("../assets/tempLee.png") : require("../assets/tempAndrew.png")} />
            </TouchableOpacity>

            <View style={{marginBottom: 10}}>
                <Text style={{fontWeight: "bold", fontSize: 20, textAlign: "center"}}>{props.user.firstName} {props.user.lastName}</Text>
                <Text style={{fontWeight: "500", fontSize: 17, textAlign: "center"}}>{props.username}</Text>
            </View>

            <Text style={{textAlign: "left", fontSize: 17, fontWeight: "400", marginBottom: 7, width: props.sideMenuWidth - 30}}>{props.accountType === "parent" ? "BABYSITTERS" : "PARENTS"}</Text>
            <View>
                {
                    props.oppositeUsers.map( oppositeUser => (
                        <TouchableOpacity style={{width: props.sideMenuWidth - 30, marginBottom: 5, flexDirection: "row", alignItems: "center"}} key={oppositeUser.username} onPress={() => props.switchCurOppositeUser(oppositeUser.username)}>
                            {
                                props.accountType === "parent" &&
                                <Image style={styles.oppositeUserImgs} resizeMode="center" source={oppositeUser.username === "drummerSkyler20" ? require("../assets/tempAndrew.png") : require("../assets/tempShane.png")} />
                            }
                            {
                                props.accountType === "babysitter" &&
                                <Image style={styles.oppositeUserImgs} resizeMode="center" source={oppositeUser.username === "leeTeacher" ? require("../assets/tempLee.png") : require("../assets/tempEden.png")} />
                            }
                            <View>
                                <Text style={{fontSize: 15, fontWeight: "400"}}>{ oppositeUser.firstName + " " + oppositeUser.lastName }</Text>
                                <Text>{ oppositeUser.username + "   |   " + oppositeUser.email }</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>

            <TouchableOpacity style={styles.button} onPress={props.openPopupDialog}>
                <Text style={styles.buttonText}>
                    Add a {props.accountType === "parent" ? "Babysitter" : "Parent"}
                </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={ () => {
                Alert.alert(
                    'Confirmation',
                    'Are you sure you want to sign out?',
                    [
                        {text: 'Cancel'},
                        {text: 'Yes', onPress: () => {
                            props.signOut();
                        }},
                      
                    ],
                )
            }}>
                <Text style={styles.buttonText}>
                    SIGN OUT
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    oppositeUserImgs: {
        width: 50,
        height: 50,
        marginRight: 10
    },

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
