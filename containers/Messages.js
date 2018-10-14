import React, { Component } from 'React';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, ScrollView, Keyboard } from 'react-native';
import { firebase, firestore } from '../utils/firebase';
import { Constants } from 'expo';

const msgsPgHeight = Dimensions.get("window").height - Constants.statusBarHeight - 85;

export default class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            textInput: "",
            isEditingMsg: false
        };

        this.all = firestore.collection("parentUsers").doc(this.props.accountType === "parent" ? this.props.user : this.props.oppositeUserUID)
        .collection("babysitters").doc(this.props.accountType === "parent" ? this.props.oppositeUserUID : this.props.user);

        this.componentDidMount = this.componentDidMount.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this.scrollToEnd = this.scrollToEnd.bind(this);
        this.addMessage = this.addMessage.bind(this);
    };

    componentDidMount() {
        setTimeout(() => {
            this.scrollToEnd({animated: true});
        }, 1);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
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
        let ar = this.props.msgs;
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
            <View style={this.state.isEditingMsg ? styles.msgsPgViewOnEditing : styles.msgsPgView}>
                <View style={{height: msgsPgHeight - 50, backgroundColor: "red"}}>
                    <ScrollView ref={ msgsScrollView => { this.msgsScrollView = msgsScrollView } } /*contentContainerStyle={this.state.isEditingMsg ? styles.msgsScrollViewOnEditing : styles.msgsScrollView}*/>
                        {
                            this.props.msgs.map( (m, i) => {
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
                    <TextInput underlineColorAndroid="transparent" style={{backgroundColor: "lightgray", flexGrow: 1}} placeholder="Type a message" value={this.state.textInput} onChangeText={ txt => this.setState({textInput: txt}) }/>
                    <Button style={{width: 50, height: 50}} title={"Send"} onPress={() => {
                        this.setState({textInput: ""});
                        this.addMessage();
                    }} />
                </View>
            </View>
        );
    };
};

const styles = StyleSheet.create({
    msgsPgView: {
        height: msgsPgHeight,
        backgroundColor: "green",
        flex: 1
    },

    msgsPgViewOnEditing: {
        height: msgsPgHeight,
        paddingBottom: 20,
        backgroundColor: "green",
        flex: 1
    },

    msgsScrollView: {
        height: msgsPgHeight - 50,
        backgroundColor: "red"
    },

    msgsScrollViewOnEditing: {
        height: msgsPgHeight - 150,
        backgroundColor: "red"
    },

    sendMsgBar: {
        flex: 1,
        flexDirection: "row",
        height: 50,
        zIndex: 1,
        elevation: 4,
        backgroundColor: "purple"
    },

    container: {
        alignItems: 'stretch',
        zIndex: 10
    },

    self: {
        alignSelf: "flex-end",
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        margin: 5,
        marginRight: 10,
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
        padding: 8,
        backgroundColor: "lightgray"
    }
});