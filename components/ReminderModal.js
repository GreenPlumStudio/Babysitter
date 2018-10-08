import React, {Component} from 'React';
import { StyleSheet, Keyboard, Text, View, Dimensions, TextInput, Button } from 'react-native';

var screen = Dimensions.get('window');

export default class ReminderModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "",
            title: ""
        };
    };
    
    render() {
        return(
            <View >
                <Text>Add a Reminder</Text>

                <Text>Title</Text>
                <TextInput ref={input1 => { this.textInput1 = input1 }} value={this.state.title} onChangeText={a => this.setState({title: a})}/>

                <Text>Text</Text>
                <TextInput ref={input2 => { this.textInput2 = input2 }} value={this.state.text} onChangeText={a => this.setState({text: a})}/>

                <Button title="Add Reminder" onPress={() => {
                    this.textInput1.clear();
                    this.textInput2.clear();
                    Keyboard.dismiss();
                    this.props.addReminder(this.state.title, this.state.text);

                }}/>
            </View>
        );
    };
};
