import React, {Component} from 'React';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';

var screen = Dimensions.get('window');

export default class AddBabysitterModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ""
        }
    }
    
    render() {
        return(
            <View >
                <Text>Add a Babysitter</Text>
                <TextInput value={this.state.text} onChangeText={a => this.setState({text: a})}/>
                <Button title="Add Babysitter" onPress={() => {this.props.addBabysitter(this.state.text)}}/>
            </View>
        );
    }
}
