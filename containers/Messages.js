import React, {Component} from 'React';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, ScrollView} from 'react-native';
import {firebase, firestore} from '../utils/firebase';


export default class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            msgs: []
        };

        this.all = firestore.collection("parentUsers").doc(this.props.accountType === "parent" ? this.props.user : this.props.oppositeUserUID)
        .collection("babysitters").doc(this.props.accountType === "parent" ? this.props.oppositeUserUID : this.props.user);
        
        this.all.onSnapshot(doc => {
            let dataObj = doc.data().messages;
            
             let msgs = dataObj.map(key => {
                return {
                    sentBy: key.sentBy,
                    text: key.text,
                    time: key.time,
                    textInput: ""
                }
            })
    
            /*
            [
            {name: 'danny', txt: 'hi'}
            {name: 'john', txt: 'bye'},
            ]
            */
    
            this.setState({msgs})
            
        });

        this.addMessage = this.addMessage.bind(this);

    };


    addMessage() {
        if (this.state.textInput === "") {
            return;
        }
        let ar = this.state.msgs;
        let date = new Date().getTime();

        console.log(ar);

        ar.push({
            "sentBy": this.props.accountType === "parent" ? true : false,
            "text": this.state.textInput,
            "time": date
        })

        console.log(ar);

        firestore.collection("parentUsers").doc(this.props.accountType === "parent" ? this.props.user : this.props.oppositeUserUID)
        .collection("babysitters").doc(this.props.accountType === "parent" ? this.props.oppositeUserUID : this.props.user).update({
            "messages": ar
        })

        this.setState({textInput: ""});
    }

    render() {
        return (
            <ScrollView ref={scroll => { this.scroll1 = scroll }}>
                <View style={{flexDirection: "column"}}>
                    <View style = {styles.container}>
                        {
                        this.state.msgs.map((m,i) => {
                            return (
                            <View key={i}>

                                {(m.sentBy && this.props.accountType != "parent" || (!m.sentBy && this.props.accountType == "parent")) && 
                                    <View >
                                        <Text style={styles.other}>{m.text}</Text>
                                    </View>
                                }
                                

                                {(m.sentBy && this.props.accountType === "parent" || (!m.sentBy && this.props.accountType != "parent")) && 
                                    <View >
                                        <Text style={styles.self}>{m.text}</Text>
                                    </View>
                                }
                            </View>
                            )
                        })
                        }
                    </View>

                    <View style={{alignSelf:"flex-end"}}>
                        <TextInput ref={input => { this.textInput = input }} value={this.state.textInput} onChangeText={a => this.setState({textInput: a})}/>
                        <Button title={"Submit"} onPress={() => {
                            this.textInput.clear();
                            this.addMessage();
                        }} />
                    </View>
                </View>
            </ScrollView>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'stretch',
        zIndex: 10
    },
    self: {
        flexDirection: 'row',
        alignSelf: "flex-end",
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    other: {
        flexDirection: 'row',
        alignSelf: "flex-start",
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
});