import React, {Component} from 'React';
import { StyleSheet, Text, View, Button, TextInput, ScrollView, Alert} from 'react-native';
import {firebase, firestore} from '../utils/firebase';

export default class BabyInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            info: this.props.info,
            currentPage: "home",

            // Input Info
            name: "",
            birthDate: "",
            allergies: "",
            diseases: "",
            other: "",
            likes: "",
            dislikes: "",
            additionalInfo: "",
        };
        this.componentDidMount = this.componentDidMount.bind(this);
    };

    componentDidMount() {
    
        if (this.state.info.name!=undefined && this.state.info.name!=null) {
            this.setState({name: this.state.info.name + ""});
        }

        if (this.state.info.birthDate!=undefined && this.state.info.birthDate!=null) {
            this.setState({birthDate: this.state.info.birthDate + ""});
        }
        if (this.state.info.allergies!=undefined && this.state.info.allergies!=null) {
            this.setState({allergies: this.state.info.allergies + ""});
        }
        if (this.state.info.diseases!=undefined && this.state.info.diseases!=null) {
            this.setState({diseases: this.state.info.diseases + ""});
        }
        if (this.state.info.other!=undefined && this.state.info.other!=null) {
            this.setState({other: this.state.info.other + ""});
        }
        if (this.state.info.likes!=undefined && this.state.info.likes!=null) {
            this.setState({likes: this.state.info.likes + ""});
        }
        if (this.state.info.dislikes!=undefined && this.state.info.dislikes!=null) {
            this.setState({dislikes: this.state.info.dislikes + ""});
        }
        if (this.state.info.additionalInfo!=undefined && this.state.info.additionalInfo!=null) {
            this.setState({additionalInfo: this.state.info.additionalInfo + ""});
        }
    }

    render() {
        if (this.state.currentPage==="home") {
            return (
                <View>
                    <Text>Baby Name: {(this.state.info.name!=undefined && this.state.info.name!=null) && <Text>{this.state.info.name}</Text>}</Text>
                    <Text>Date of Birth: {(this.state.info.birthDate!=undefined && this.state.info.birthDate!=null) && <Text>{this.state.info.birthDate}</Text>}</Text>
                    
                    <Text>------------</Text>

                    <Text>Allergies: {(this.state.info.allergies!=undefined && this.state.info.allergies!=null) && <Text>{this.state.info.allergies}</Text>}</Text>
                    <Text>Diseases: {(this.state.info.diseases!=undefined && this.state.info.diseases!=null) && <Text>{this.state.info.diseases}</Text>}</Text>
                    <Text>Other: {(this.state.info.other!=undefined && this.state.info.other!=null) && <Text>{this.state.info.other}</Text>}</Text>

                    <Text>------------</Text>

                    <Text>Likes: {(this.state.info.likes!=undefined && this.state.info.likes!=null) && <Text>{this.state.info.likes}</Text>}</Text>
                    <Text>Dislikes: {(this.state.info.dislikes!=undefined && this.state.info.dislikes!=null) && <Text>{this.state.info.dislikes}</Text>}</Text>
                    <Text>Additional Information: {(this.state.info.additionalInfo!=undefined && this.state.info.additionalInfo!=null) && <Text>{this.state.info.additionalInfo}</Text>}</Text>

                    {this.props.accountType === "parent" &&
                        <View>
                            <Button title={"Edit Baby Info"} onPress={() => {this.setState({currentPage: "edit"})}}/>
                        </View>
                    }
                </View>
            );
        }
        else {
            return (
                    <ScrollView>
                    <View>
                        <Button title={"Back to Baby Info"} onPress={() => {this.setState({currentPage: "home"})}}/>
                        <Text>Edit</Text>

                        <Text>Name: </Text><TextInput value={this.state.name} onChangeText={(a) => {this.setState({name: a})}}/>
                        <Button title={"X"} onPress={() => {this.setState({name: ""})}} />
                        
                        <Text>Birth Date: </Text><TextInput value={this.state.birthDate} onChangeText={(a) => {this.setState({birthDate: a})}}/>
                        <Button title={"X"} onPress={() => {this.setState({birthDate: ""})}} />

                        <Text>------------</Text>

                        <Text>Allergies: </Text><TextInput value={this.state.allergies} onChangeText={(a) => {this.setState({allergies: a})}}/>
                        <Button title={"X"} onPress={() => {this.setState({allergies: ""})}} />

                        <Text>Diseases: </Text><TextInput value={this.state.diseases} onChangeText={(a) => {this.setState({diseases: a})}}/>
                        <Button title={"X"} onPress={() => {this.setState({diseases: ""})}} />

                        <Text>Other: </Text><TextInput value={this.state.other} onChangeText={(a) => {this.setState({other: a})}}/>
                        <Button title={"X"} onPress={() => {this.setState({other: ""})}} />

                        <Text>------------</Text>

                        <Text>Likes: </Text><TextInput value={this.state.likes} onChangeText={(a) => {this.setState({likes: a})}}/>
                        <Button title={"X"} onPress={() => {this.setState({likes: ""})}} />

                        <Text>Dislikes: </Text><TextInput value={this.state.dislikes} onChangeText={(a) => {this.setState({dislikes: a})}}/>
                        <Button title={"X"} onPress={() => {this.setState({dislikes: ""})}} />

                        <Text>Additional Information: </Text><TextInput value={this.state.additionalInfo} onChangeText={(a) => {this.setState({additionalInfo: a})}}/>
                        <Button title={"X"} onPress={() => {this.setState({additionalInfo: ""})}} />

                        
                        <Button title={"Save Changes"} onPress={() => {
                            Alert.alert(
                                'Confirmation',
                                'Are you sure you want to save your changes?',
                                [
                                    {text: 'Cancel'},
                                    {text: 'Yes', onPress: () => {
                                        this.setState({currentPage: "home"});
                                        this.props.editBabyInfo(this.state.name, this.state.birthDate, this.state.allergies,
                                            this.state.diseases, this.state.other, this.state.likes, this.state.dislikes, this.state.additionalInfo);
                                    }},
                                  
                                ],
                            )
                        }} />
                    </View>
                </ScrollView>
            )
        }
    };
};
