import React, {Component} from 'React';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';

var screen = Dimensions.get('window');

export default class ReminderModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: "",
            title: ""
        }
    }
    
    render() {
        return(
            <View >
                <Text>Add a Reminder</Text>

                <Text>Title</Text>
                <TextInput value={this.state.title} onChangeText={a => this.setState({title: a})}/>

                <Text>Text</Text>
                <TextInput value={this.state.text} onChangeText={a => this.setState({text: a})}/>

                <Button title="Add Reminder" onPress={() => {this.props.addReminder(this.state.title, this.state.text)}}/>
            </View>
        );
    }
}
