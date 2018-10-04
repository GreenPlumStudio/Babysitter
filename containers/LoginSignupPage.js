import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Keyboard } from 'react-native';

import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

export default class LoginSignupPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isFormFocused: false
        };

        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    };

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    };

    _keyboardDidShow() {
        this.setState({isFormFocused: true});
    };
    
    _keyboardDidHide() {
        this.setState({isFormFocused: false});
    };
    
    render() {
        return (
            <View style={styles.loginSignupPage}>
                <TouchableOpacity style={styles.backButton} onPress={this.props.backToChooseAccountType}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>

                {
                    this.props.loginOrSignup === "login" &&
                        <LoginPage accountType={this.props.accountType} isFormFocused={this.state.isFormFocused} />
                }
                {
                    this.props.loginOrSignup === "signup" &&
                        <SignupPage accountType={this.props.accountType} isFormFocused={this.state.isFormFocused} />
                }
                
                <Button title={this.props.loginOrSignup === "login" ? "Don't have an account? Sign up here" : "Already have an account? Log in here"} onPress={() => this.props.setLoginOrSignup(this.props.loginOrSignup === "login" ? "signup" : "login")} />
            </View>
        );
    };
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
