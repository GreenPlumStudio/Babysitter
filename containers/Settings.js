import React, { Component } from 'React';
import { Text, View, Button, Dimensions, ScrollView } from 'react-native';
import {CheckBox} from 'react-native-elements';

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.checked,
            view: "home"
        };
    };
    render() {
        if (this.state.view === "home") {
            return (
                <View>
                    <Text>Email: {this.props.user.email}</Text>
                    <Text>First Name: {this.props.user.firstName}</Text>
                    <Text>Last Name: {this.props.user.lastName}</Text>
                    <Text>User Name: {this.props.user.userName}</Text>

                    <Button onPress={() => this.setState({view: "background"})} title="Change Background Color"/>
                </View>
            )
        } else {
            return (
            <View>
                <Text>Background Color: </Text>

                <CheckBox
                    title='Yellow'
                    checked={this.state.checked==="#f1ff75"}
                    checkedIcon='dot-circle-o'
                    checkedColor='#f1ff75'
                    uncheckedIcon='circle-o'
                    onPress={() => this.setState({checked: '#f1ff75'})}
                />
                    
                <CheckBox
                    title='Blue'
                    checked={this.state.checked==="skyblue"}
                    checkedIcon='dot-circle-o'
                    checkedColor='skyblue'
                    uncheckedIcon='circle-o'
                    onPress={() => {this.setState({checked: 'skyblue'});}}
                />
                
                <CheckBox
                    title='White'
                    checked={this.state.checked==="white"}
                    checkedIcon='dot-circle-o'
                    checkedColor='white'
                    uncheckedIcon='circle-o'
                    onPress={() => this.setState({checked: 'white'})}
                />

                <CheckBox
                    title='Green'
                    checked={this.state.checked==="lightgreen"}
                    checkedIcon='dot-circle-o'
                    checkedColor='lightgreen'
                    uncheckedIcon='circle-o'
                    onPress={() => this.setState({checked: 'lightgreen'})}
                />

                <CheckBox
                    title='Pink'
                    checked={this.state.checked==="lightpink"}
                    checkedIcon='dot-circle-o'
                    checkedColor='lightpink'
                    uncheckedIcon='circle-o'
                    onPress={() => this.setState({checked: 'lightpink'})}
                />

                <CheckBox
                    title='Cyan'
                    checked={this.state.checked==="cyan"}
                    checkedIcon='dot-circle-o'
                    checkedColor='cyan'
                    uncheckedIcon='circle-o'
                    onPress={() => this.setState({checked: 'cyan'})}
                />

                <CheckBox
                    title='Orange'
                    checked={this.state.checked==="orange"}
                    checkedIcon='dot-circle-o'
                    checkedColor='orange'
                    uncheckedIcon='circle-o'
                    onPress={() => this.setState({checked: 'orange'})}
                />

                <CheckBox
                    title='Purple'
                    checked={this.state.checked==="#9535f4"}
                    checkedIcon='dot-circle-o'
                    checkedColor='#9535f4'
                    uncheckedIcon='circle-o'
                    onPress={() => this.setState({checked: '#9535f4'})}
                />

                <Button title= "Submit" onPress={ () => {
                    this.props.changeBackgroundColor(this.state.checked);
                    this.setState({view: "home"});
                }} />
            </View>
            )
        }
    }
}