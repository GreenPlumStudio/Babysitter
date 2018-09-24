import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const WelcomePage = (props) => {
    return (
        <View style={styles.welcomePage}>
            <Text style={styles.logo}>Babysitter</Text>

            <View style={{alignItems: "center"}}>
                <Text style={{fontSize: 20, fontWeight: "300"}}>I am a......</Text>

                <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", maxHeight: 100}}>

                    <TouchableOpacity style={{marginRight: 10, backgroundColor: "#2196F3", borderRadius: 2, elevation: 4}} onPress={() => props.changeAccountType("parent")}>

                        <Text style={{color: "white", fontSize: 15, fontWeight: "500", padding: 8}}>Parent</Text>

                    </TouchableOpacity>

                    <TouchableOpacity style={{marginLeft: 10, backgroundColor: "#2196F3", borderRadius: 2, elevation: 4}} onPress={() => props.changeAccountType("babysitter")}>

                        <Text style={{color: "white", fontSize: 15, fontWeight: "500", padding: 8}}>Babysitter</Text>

                    </TouchableOpacity>

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    welcomePage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "lightblue"
    },
    
    logo: {
        marginBottom: 50,
        fontSize: 50,
        fontWeight: "700",
        color: "cornflowerblue",
        elevation: 2
    }
});

export default WelcomePage;
