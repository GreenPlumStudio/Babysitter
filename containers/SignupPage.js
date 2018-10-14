import React, {Component} from 'React';
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { firebase, firestore } from '../utils/firebase';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            username: "",
            emailAddress: "",
            password: "",
            confirmPassword: "",
            errMsg: ""
        };

        this.trySignup = this.trySignup.bind(this);
    };

    trySignup() {
        if (this.state.firstName === "" || this.state.lastName === "" || this.state.username === "" || this.state.emailAddress === "" || this.state.password === "" || this.state.confirmPassword === "") {
            this.setState({errMsg: "Please fill out all fields"});
            return;
        } else if (this.state.password !== this.state.confirmPassword) {
            this.setState({errMsg: "Passwords do not match"});
            return;
        }

        firestore.collection(this.props.accountType + "UsernameToUID").get().then( col => {
            
            // check if username already exists~
            let doesUsernameExist = false;
            col.docs.forEach( doc => {
                if (doc.id === this.state.username) {
                    this.setState({errMsg: "Username already exists"});
                    doesUsernameExist = true;
                    return;
                }
            });
            if (doesUsernameExist) return;
            // ~check if username already exists

            firebase.auth().createUserWithEmailAndPassword(this.state.emailAddress, this.state.password).then(() => {
                let user = firebase.auth().currentUser;
                let colType = this.props.accountType + "Users";
                let oppositeColType = this.props.accountType === "parent" ? "babysitters" : "parents";
    
                firestore.collection(colType).doc(user.uid).set({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    username: this.state.username,
                    email: this.state.emailAddress
                });
    
                firestore.collection(colType).doc(user.uid).collection(oppositeColType).doc("placeholder").set({
                    placeholder: "placeholder"
                });
    
                firestore.collection(this.props.accountType + "UsernameToUID").doc(this.state.username).set({
                    uid: user.uid
                });
            })
            .catch(error => {
                this.setState({errMsg: error.message});
            });
        });
    };

    render() {
        return (
            <View style={styles.signupPage}>
                <Text style={this.props.isFormFocused ? styles.formTitleOnFormFocus : styles.formTitle}>
                    {(this.props.accountType === "parent" ? "Parent" : "Babysitter") + " Sign Up"}
                </Text>

                <ScrollView>
                    <TextInput style={styles.formInput} placeholder="First Name" textContentType="givenName" value={this.state.firstName} onChangeText={text => this.setState({firstName: text})} />

                    <TextInput style={styles.formInput} placeholder="Last Name" textContentType="familyName" value={this.state.lastName} onChangeText={text => this.setState({lastName: text})} />
                    
                    <TextInput style={styles.formInput} placeholder="Username" textContentType="username" value={this.state.username} onChangeText={text => this.setState({username: text})} />
                    
                    <TextInput style={styles.formInput} placeholder="Email" textContentType="emailAddress" keyboardType="email-address" value={this.state.emailAddress} onChangeText={text => this.setState({emailAddress: text})} />
                    
                    <TextInput style={styles.formInput} placeholder="Password" textContentType="password" secureTextEntry={true} value={this.state.password} onChangeText={text => this.setState({password: text})} />
                    
                    <TextInput style={styles.formInput} placeholder="Confirm Password" textContentType="password" secureTextEntry={true} value={this.state.confirmPassword} onChangeText={text => this.setState({confirmPassword: text})} />
                </ScrollView>

                <Text style={styles.errMsg}>{this.state.errMsg}</Text>

                <TouchableOpacity style={this.props.isFormFocused ? styles.signupButtonOnFormFocus : styles.signupButton} onPress={this.trySignup}>
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
