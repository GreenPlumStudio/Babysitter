import React, {Component} from 'React';
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { firebase, firestore } from '../utils/firebase';

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
            errMsg: "",
            isFormFocused: false
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

        console.log(this.state.accountType);

        firebase.auth().createUserWithEmailAndPassword(this.state.emailAddress, this.state.password)
            .then(() => {
                var user = firebase.auth().currentUser;
                let type = "parentUsers";
                let type1 = "babysitters";
                if (this.state.accountType !== "parent") {
                    type = "babysitterUsers";
                    type1 = "parents";
                }
                firestore.collection(type).doc(user.uid).set({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    username: this.state.username,
                    email: this.state.emailAddress
                });

                firestore.collection(type).doc(user.uid).collection(type1).doc("test").set({
                    test: ""
                });
            })
            .catch(err => {
                console.log(this.state.emailAddress);
                this.setState({errMsg: err.message});
            });
    };

    onFormFocus() {
        this.setState({formTitleSize: 15, isFormFocused: true});
    };

    onFormEndEditing() {
        this.setState({formTitleSize: 30, isFormFocused: false});
    };

    render() {
        let formTitle = {
            fontSize: this.state.formTitleSize,
            fontWeight: "500",
            color: "dodgerblue",
            elevation: 2,
            marginTop: 25,
            marginBottom: 20
        };

        return (
            <View style={styles.signupPage}>
                <Text style={formTitle}>{(this.state.accountType === "parent" ? "Parent" : "Babysitter") + " Sign Up"}</Text>

                <ScrollView>
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="First Name" textContentType="givenName" value={this.state.firstName} onChangeText={text => this.setState({firstName: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />

                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Last Name" textContentType="familyName" value={this.state.lastName} onChangeText={text => this.setState({lastName: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                    
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Username" textContentType="username" value={this.state.username} onChangeText={text => this.setState({username: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                    
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Email" textContentType="emailAddress" keyboardType="email-address" value={this.state.emailAddress} onChangeText={text => this.setState({emailAddress: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                    
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Password" textContentType="password" secureTextEntry={true} value={this.state.password} onChangeText={text => this.setState({password: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                    
                    <TextInput style={styles.formInput} underlineColorAndroid="transparent" placeholder="Confirm Password" textContentType="password" secureTextEntry={true} value={this.state.confirmPassword} onChangeText={text => this.setState({confirmPassword: text})} onFocus={this.onFormFocus} onEndEditing={this.onFormEndEditing} />
                </ScrollView>

                <Text style={styles.errMsg}>{this.state.errMsg}</Text>

                <TouchableOpacity style={this.state.isFormFocused ? styles.signupButtonOnFormFocus : styles.signupButton} onPress={this.trySignup.bind(this)}>
                    <Text style={styles.signupButtonText}>SIGN UP</Text>
                </TouchableOpacity>
            </View>
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

    formInput: {
        backgroundColor: "white",
        width: 0.85 * Dimensions.get("window").width,
        padding: 20,
        fontSize: 20,
        borderRadius: 2,
        elevation: 2,
        marginBottom: 10
    },

    errMsg: {
        fontSize: 15,
        color: "red",
        textAlign: "center",
        margin: 5
    },

    signupButton: {
        backgroundColor: "#2196F3",
        borderRadius: 2,
        elevation: 4,
        margin: 5
    },

    signupButtonOnFormFocus: {
        backgroundColor: "#2196F3",
        borderRadius: 2,
        elevation: 4,
        margin: 5,
        marginTop: Dimensions.get("window").height * 0.3
    },

    signupButtonText: {
        color: "white",
        fontSize: 15,
        fontWeight: "500",
        padding: 8
    }
});
