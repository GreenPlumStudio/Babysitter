import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';

import LoginPage from '../containers/LoginPage';
import SignupPage from '../containers/SignupPage';

const LoginSignupPage = (props) => {
    let loginOrSignup = props.loginOrSignup;

    return (
        <View style={styles.loginSignupPage}>
            <TouchableOpacity style={styles.backButton} onPress={props.backToChooseAccountType}>
                <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            {
                loginOrSignup === "login" &&
                    <LoginPage accountType={props.accountType} />
            }
            {
                loginOrSignup === "signup" &&
                    <SignupPage accountType={props.accountType} />
            }
            
            <Button title={loginOrSignup === "login" ? "Don't have an account? Sign up here" : "Already have an account? Log in here"} onPress={() => props.setLoginOrSignup(props.loginOrSignup === "login" ? "signup" : "login")} />
        </View>
    );
};

const styles = StyleSheet.create({
    loginSignupPage: {
        flex: 1,
        flexGrow: 1
    },
  
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
        elevation: 4,
        zIndex: 1
    },
  
    backButtonText: {
        color: "gray",
        fontSize: 20,
        fontWeight: "500",
        padding: 8
    }
});

export default LoginSignupPage;
