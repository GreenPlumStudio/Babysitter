import React, { Component } from 'React';
import { Text, View, Button, Dimensions, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';

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
                <View style={{padding: 15}}>
                    <View style={{backgroundColor: "#e8e8e8", borderRadius: 10, elevation: 4, marginBottom: 15, padding: 10}}>
                        <Text style={{fontSize: 20, fontWeight: "500"}}>User Info:</Text>

                        <Text style={{fontSize: 15, margin: 5}}>Email: {this.props.user.email}</Text>
                        <Text style={{fontSize: 15, margin: 5}}>First Name: {this.props.user.firstName}</Text>
                        <Text style={{fontSize: 15, margin: 5}}>Last Name: {this.props.user.lastName}</Text>
                        <Text style={{fontSize: 15, margin: 5}}>User Name: {this.props.user.username}</Text>
                    </View>

                    <Button style={{margin: 10, borderRadius: 10}} onPress={() => this.setState({view: "background"})} title="Change Background Color"/>
                </View>
            )
        } else {
            return (
            <View style={{padding: 15}}>
                <Text style={{fontSize: 20, fontWeight: "500"}}>Background Color:</Text>

                <View style={{marginTop: 10, marginBottom: 10}}>
                    <CheckBox
                        title='Light Gray'
                        checked={this.state.checked==="#f2f2f2"}
                        checkedIcon='dot-circle-o'
                        checkedColor='#f2f2f2'
                        uncheckedIcon='circle-o'
                        onPress={() => this.setState({checked: '#f2f2f2'})}
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
                        title='Yellow'
                        checked={this.state.checked==="#f1ff75"}
                        checkedIcon='dot-circle-o'
                        checkedColor='#f1ff75'
                        uncheckedIcon='circle-o'
                        onPress={() => this.setState({checked: '#f1ff75'})}
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
                        title='Cyan'
                        checked={this.state.checked==="cyan"}
                        checkedIcon='dot-circle-o'
                        checkedColor='cyan'
                        uncheckedIcon='circle-o'
                        onPress={() => this.setState({checked: 'cyan'})}
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
                        title='Purple'
                        checked={this.state.checked==="#871b87"}
                        checkedIcon='dot-circle-o'
                        checkedColor='#871b87'
                        uncheckedIcon='circle-o'
                        onPress={() => this.setState({checked: '#871b87'})}
                    />

                    <CheckBox
                        title='Pink'
                        checked={this.state.checked==="lightpink"}
                        checkedIcon='dot-circle-o'
                        checkedColor='lightpink'
                        uncheckedIcon='circle-o'
                        onPress={() => this.setState({checked: 'lightpink'})}
                    />
                </View>

                <Button title= "Submit" onPress={ () => {
                    this.props.changeBackgroundColor(this.state.checked);
                    this.setState({view: "home"});
                }} />
            </View>
            )
        }
    }
}