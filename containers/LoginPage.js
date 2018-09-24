import React, {Component} from 'React';
import { StyleSheet, Text, View, TextInput, Dimensions, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { firebase } from '../utils/firebase';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accountType: props.accountType,
            formTitleSize: 30,
            emailAddress: "",
            password: "",
            errMsg: ""
        };

        this.onFormFocus = this.onFormFocus.bind(this);
        this.onFormEndEditing = this.onFormEndEditing.bind(this);
    };

    tryLogin() {
        firebase.auth().signInWithEmailAndPassword(this.state.emailAddress, this.state.password)
            .then(() => {
                console.log("success");
            })
            .catch(err => {
                this.setState({errMsg: err.message})
            });
    };

    onFormFocus() {
        this.setState({formTitleSize: 15});
    };

    onFormEndEditing() {
        this.setState({formTitleSize: 30});
    };

    render() {
        let formTitle = {
            fontSize: this.state.formTitleSize,
            fontWeight: "500",
            color: "dodgerblue",
            elevation: 2
        };

        return (
            <KeyboardAvoidingView style={styles.loginPage} behavior="padding" enabled>
                <Text style={formTitle}>{(this.state.accountType === "parent" ? "Parent" : "Babysitter") + " Log In"}</Text>

                <View style={styles.loginForm}>
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Email" textContentType="emailAddress" keyboardType="email-address" value={this.state.emailAddress} onChangeText={text => this.setState({emailAddress: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                    
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Password" textContentType="password" secureTextEntry={true} value={this.state.password} onChangeText={text => this.setState({password: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                </View>

                <Text style={styles.errMsg}>{this.state.errMsg}</Text>

                <TouchableOpacity style={styles.loginButton} onPress={this.tryLogin.bind(this)}>
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
