import React, {Component} from 'React';
import { StyleSheet, Text, View, TextInput, Dimensions, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { firebase } from '../utils/firebase';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accountType: props.accountType,
            emailAddress: "",
            password: "",
            errMsg: ""
        };

        this.tryLogin = this.tryLogin.bind(this);
    };

    tryLogin() {
        firebase.auth().signInWithEmailAndPassword(this.state.emailAddress, this.state.password)
            .catch(err => {
                this.setState({errMsg: err.message})
            });
    };

    render() {
        return (
            <KeyboardAvoidingView style={styles.loginPage} behavior="padding" enabled>
                <Text style={this.props.isFormFocused ? styles.formTitleOnFormFocus : styles.formTitle}>
                    {(this.state.accountType === "parent" ? "Parent" : "Babysitter") + " Log In"}
                </Text>

                <View style={styles.loginForm}>
                    <TextInput underlineColorAndroid="transparent" style={styles.formInput} placeholder="Email" textContentType="emailAddress" keyboardType="email-address" value={this.state.emailAddress} onChangeText={text => this.setState({emailAddress: text})} />
                    
                    <TextInput underlineColorAndroid="transparent" style={styles.formInput} placeholder="Password" textContentType="password" secureTextEntry={true} value={this.state.password} onChangeText={text => this.setState({password: text})} />
                </View>

                <Text style={styles.errMsg}>{this.state.errMsg}</Text>

                <TouchableOpacity style={styles.loginButton} onPress={this.tryLogin}>
                    <Text style={styles.loginButtonText}>LOG IN</Text>
                </TouchableOpacity>

                <View style={{maxHeight: 50}} />
            </KeyboardAvoidingView>
        );
    };
};

const styles = StyleSheet.create({
    loginPage: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "lightblue"
    },

    formTitle: {
        fontSize: 30,
        fontWeight: "500",
        color: "dodgerblue",
        elevation: 2,
        marginTop: 25,
        marginBottom: 20
    },

    formTitleOnFormFocus: {
        fontSize: 15,
        fontWeight: "500",
        color: "dodgerblue",
        elevation: 2,
        marginTop: 25,
        marginBottom: 20
    },

    loginForm: {
        flex: 1,
        justifyContent: "space-between",
        maxHeight: 150
    },

    formInput: {
        backgroundColor: "white",
        width: 0.85 * Dimensions.get("window").width,
        padding: 20,
        fontSize: 20,
        borderRadius: 2,
        elevation: 2
    },

    errMsg: {
        fontSize: 15,
        color: "red",
        textAlign: "center"
    },

    loginButton: {
        backgroundColor: "#2196F3",
        borderRadius: 2,
        elevation: 4
    },

    loginButtonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "500",
        padding: 8
    }
});
