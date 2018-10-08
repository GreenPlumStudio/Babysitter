import React, {Component} from 'React';
import { StyleSheet, Text, View, Dimensions, TextInput, Button } from 'react-native';

export default class AddBabysitterModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ""
        };
    };
    
    render() {
        return (
            <View>
                {
                    this.props.accountType === "parent" &&
                    <View>
                        <Text>Add a Babysitter</Text>
                        <TextInput ref={ input1 => { this.textInput1 = input1 } } placeholder="Username" value={this.state.text} onChangeText={a => this.setState({text: a})}/>
                        <Button title="Add Babysitter" onPress={() => {
                            this.textInput1.clear();
                            this.props.addBabysitter(this.state.text)
                        }} />
                    </View>
                }
                {
                    this.props.accountType === "babysitter" &&
                    <View>
                        <Text>Add a Parent</Text>
                        <TextInput ref={ input2 => { this.textInput2 = input2 } } placeholder="Username" value={this.state.text} onChangeText={a => this.setState({text: a})}/>
                        <Button title="Add Parent" onPress={() => {
                            this.textInput2.clear();
                            this.props.addParent(this.state.text)
                        }} />
                    </View>
                }
            </View>
        );
    };
};
