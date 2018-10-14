import React, { Component } from 'React';
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { firestore } from '../utils/firebase';
import { Constants } from 'expo';

import KeyboardSpacer from 'react-native-keyboard-spacer';

const msgsPgHeight = Dimensions.get("window").height - Constants.statusBarHeight - 85;

export default class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            msgs: [],
            textInput: "",
            isEditingMsg: false
        };

        this.all = firestore.collection("parentUsers").doc(this.props.accountType === "parent" ? this.props.user : this.props.oppositeUserUID)
        .collection("babysitters").doc(this.props.accountType === "parent" ? this.props.oppositeUserUID : this.props.user);
        
        this.all.onSnapshot( doc => {
            let dataObj = doc.data().messages;
            
            let msgs = dataObj.map( key => {
                return {
                    sentBy: key.sentBy,
                    text: key.text,
                    time: key.time,
                    textInput: ""
                };
            });
    
            /*
                [
                    {name: 'danny', txt: 'hi'},
                    {name: 'john', txt: 'bye'}
                ]
            */
    
            this.setState({msgs});
            
        });

        this.componentDidMount = this.componentDidMount.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.scrollToEnd = this.scrollToEnd.bind(this);
        this.addMessage = this.addMessage.bind(this);
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        setTimeout(() => {
            this.scrollToEnd();
        }, 500);
    };

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    };

    _keyboardDidShow() {
        this.setState({isEditingMsg: true});
    };
    
    _keyboardDidHide() {
        this.setState({isEditingMsg: false});
    };

    scrollToEnd() {
        this.msgsScrollView.scrollToEnd({animated: false});
    };

    addMessage() {
        if (this.state.textInput === "") {
            return;
        }
        let ar = this.state.msgs;
        let date = new Date().getTime();

        ar.push({
            "sentBy": this.props.accountType === "parent" ? true : false,
            "text": this.state.textInput,
            "time": date
        });

        firestore.collection("parentUsers").doc(this.props.accountType === "parent" ? this.props.user : this.props.oppositeUserUID)
        .collection("babysitters").doc(this.props.accountType === "parent" ? this.props.oppositeUserUID : this.props.user).update({
            "messages": ar
        }).then(() => {
            this.setState({textInput: ""});
            this.scrollToEnd();
        });
    };

    render() {
        return (
            <View style={styles.msgsPgView}>
                <View style={{maxHeight: msgsPgHeight - 50, backgroundColor: "red"}}>
                    <ScrollView ref={ msgsScrollView => { this.msgsScrollView = msgsScrollView } }>
                        {
                            this.state.msgs.map( (m, i) => {
                                if (m.sentBy && this.props.accountType !== "babysitter" || !m.sentBy && this.props.accountType !== "parent") {
                                    return (
                                        <View key={i}>
                                            <Text style={styles.self}>{m.text}</Text>
                                        </View>
                                    );
                                } else {
                                    return (
                                        <View key={i}>
                                            <Text style={styles.other}>{m.text}</Text>
                                        </View>
                                    );
                                }
                            })
                        }
                    </ScrollView>
                </View>
                
                { /* Send msg bar */ }
                <View style={styles.sendMsgBar}>
                    <TextInput underlineColorAndroid="transparent" style={{backgroundColor: "lightgray", flexBasis: 0, flexGrow: 1, paddingLeft: 7}} placeholder=" Type a message" value={this.state.textInput} onChangeText={ txt => this.setState({textInput: txt}) }/>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.setState({textInput: ""});
                        this.addMessage();
                    }}>
                        <Text style={styles.buttonText}>Send</Text>
                    </TouchableOpacity>
                </View>
                
                { /* Imported from react-native-keyboard-spacer */ }
                <KeyboardSpacer/>
            </View>
        );
    };
};

const styles = StyleSheet.create({
    msgsPgView: {
        backgroundColor: "green",
        flex: 1
    },

    msgsPgViewOnEditing: {
        height: msgsPgHeight,
        paddingBottom: 20,
        backgroundColor: "green",
        flex: 1
    },

    self: {
        alignSelf: "flex-end",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        margin: 5,
        marginRight: 10,
        marginLeft: 35,
        padding: 8,
        backgroundColor: "deepskyblue"
    },

    other: {
        alignSelf: "flex-start",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        margin: 5,
        marginLeft: 10,
        marginRight: 35,
        padding: 8,
        backgroundColor: "lightgray"
    },

    sendMsgBar: {
        flex: 1,
        flexDirection: "row",
        height: 50,
        zIndex: 1,
        elevation: 4,
        backgroundColor: "purple"
    },

    sendMsgBarOnEditing: {
        flex: 1,
        flexDirection: "row",
        height: 50,
        zIndex: 1,
        elevation: 4,
        backgroundColor: "purple",
        marginBottom: Dimensions.get("window").height * 0.3
    },

    button: {
        backgroundColor: "#2196F3",
        borderRadius: 2,
        elevation: 4,
        height: 50,
        width: 50,
        justifyContent: "center"
    },

    buttonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
        padding: 8,
        textAlign: "center"
    }
});