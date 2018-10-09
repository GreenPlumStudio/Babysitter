import React, {Component} from 'React';
import { StyleSheet, Text, View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat'

export default class Messages extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            msgs: [],
        };

        firestore.collection("parentUsers").doc(this.props.accountType === "parent" ? this.props.user.uid : this.props.oppositeUser)
            .collection("babysitters").doc(this.props.accountType === "parent" ? this.props.oppositeUser : this.props.user.uid)
            .onSnapshot(doc => {
                let dataObj = doc.data().messages;
                
                let msgs = dataObj.map(key => {
                    return {
                        sentBy: key.sentBy,
                        text: key.text,
                        time: key.time
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
    };

    

    render() {
        return (
            <View style={styles.container}>
                {
                this.state.msgs.map((m,i) => {

                    let nameView = <View style={{width: Dimensions.get('window').width/10, backgroundColor: 'gray'}}>
                                    <Text >{m.sentBy}</Text>
                                    </View>

                    return (
                    <View style={{
                        opacity: this.state.opacity
                    }} key={m.time}>
                    
                        {sentBy==this.props.user.uid && nameView}

                        <View style={{flex:1}}>
                            <Text>{m.text}</Text>
                        </View>

                        {sentBy!=this.props.user.uid && nameView}
                    </View>
                    )
                })
                }
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexBasis: 0,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'center',
      borderBottomColor: 'red',
      borderBottomWidth: 2,
      marginTop: Constants.statusBarHeight
    },
    row: {
      flexDirection: 'row',
      flex: 1,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
    },
    rowOdd: {},
    rowEven: {}
  });