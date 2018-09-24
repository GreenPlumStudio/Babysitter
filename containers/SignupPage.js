import React, {Component} from 'React';
import { StyleSheet, Text, View, Button, TextInput, Dimensions, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { firebase, firestore } from '../utils/firebase';
import { Constants } from 'expo';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accountType: props.accountType,
            formTitleSize: 30,
            firstName: "",
            lastName: "",
            username: "",
            emailAddress: "",
            password: "",
            confirmPassword: "",
            errMsg: ""
        };

        this.onFormFocus = this.onFormFocus.bind(this);
        this.onFormEndEditing = this.onFormEndEditing.bind(this);
    };

    trySignup() {
        if (this.state.firstName === "" || this.state.lastName === "" || this.state.username === "" || this.state.emailAddress === "" || this.state.password === "" || this.state.confirmPassword === "") {
            this.setState({errMsg: "Please fill out all fields"});
            return;
        } else if (this.state.password !== this.state.confirmPassword) {
            this.setState({errMsg: ("Passwords do not match")});
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(this.state.emailAddress, this.state.password)
            .then(() => {
                let type = "";
                let type1 = "";
                if (this.state.accountType === "Parent") {
                    type = "parentUsers";
                    type1 = "babySitters";
                } else {
                    type = "babySitterUsers";
                    type1 = "parents";
                }
                firestore.collection(type).doc(firebase.auth().currentUser.uid).set({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    username: this.state.username,
                    type1: {}
                });
            })
            .catch(err => {
                console.log(this.state.emailAddress);
                this.setState({errMsg: err.message});
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
            <KeyboardAvoidingView style={styles.signupPage} behavior="padding" enabled>
                <Text style={formTitle}>{(this.state.accountType === "parent" ? "Parent" : "Babysitter") + " Sign Up"}</Text>

                <View style={styles.signupForm}>
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="First Name" textContentType="givenName" value={this.state.firstName} onChangeText={text => this.setState({firstName: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />

                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Last Name" textContentType="familyName" value={this.state.lastName} onChangeText={text => this.setState({lastName: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                    
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Username" textContentType="username" value={this.state.username} onChangeText={text => this.setState({username: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                    
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Email" textContentType="emailAddress" keyboardType="email-address" value={this.state.emailAddress} onChangeText={text => this.setState({emailAddress: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                    
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Password" textContentType="password" secureTextEntry={true} value={this.state.password} onChangeText={text => this.setState({password: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                    
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Confirm Password" textContentType="password" secureTextEntry={true} value={this.state.confirmPassword} onChangeText={text => this.setState({confirmPassword: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                </View>

                <Text style={styles.errMsg}>{this.state.errMsg}</Text>

                <TouchableOpacity style={styles.signupButton} onPress={this.trySignup.bind(this)}>
                    <Text style={styles.signupButtonText}>SIGN UP</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    };
};

const styles = StyleSheet.create({
    signupPage: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "lightblue"
    },

    signupForm: {
        flex: 1,
        justifyContent: "space-between"
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

    signupButton: {
        backgroundColor: "#2196F3",
        borderRadius: 2,
        elevation: 4
    },

    signupButtonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "500",
        padding: 8
    }
});
