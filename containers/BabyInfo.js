import React, { Component } from 'React';
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions } from 'react-native';
// import { firebase, firestore } from '../utils/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Constants } from 'expo';

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
            additionalInfo: ""
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
                <View style={{flex: 1}}>
                    <View style={{flex: 1, backgroundColor: "#f5f5f5"}}>
                        <Text style={styles.infoCategoryLabel}>GENERAL INFO</Text>

                        <View style={styles.infoCategoryView}>
                            <Text style={styles.infoDetailLabel}>Baby's Name: {(this.state.info.name!=undefined && this.state.info.name!=null) && <Text style={styles.infoDetail}>{this.state.info.name}</Text>}</Text>
                            <Text style={styles.infoDetailLabel}>Date of Birth: {(this.state.info.birthDate!=undefined && this.state.info.birthDate!=null) && <Text style={styles.infoDetail}>{this.state.info.birthDate}</Text>}</Text>
                        </View>
                        
                        <Text style={styles.infoCategoryLabel}>MEDICAL INFO</Text>

                        <View style={styles.infoCategoryView}>
                            <Text style={styles.infoDetailLabel}>Allergies: {(this.state.info.allergies!=undefined && this.state.info.allergies!=null) && <Text style={styles.infoDetail}>{this.state.info.allergies}</Text>}</Text>
                            <Text style={styles.infoDetailLabel}>Diseases: {(this.state.info.diseases!=undefined && this.state.info.diseases!=null) && <Text style={styles.infoDetail}>{this.state.info.diseases}</Text>}</Text>
                            <Text style={styles.infoDetailLabel}>Other: {(this.state.info.other!=undefined && this.state.info.other!=null) && <Text style={styles.infoDetail}>{this.state.info.other}</Text>}</Text>
                        </View>

                        <Text style={styles.infoCategoryLabel}>PERSONAL INFO</Text>

                        <View style={styles.infoCategoryView}>
                            <Text style={styles.infoDetailLabel}>Likes: {(this.state.info.likes!=undefined && this.state.info.likes!=null) && <Text style={styles.infoDetail}>{this.state.info.likes}</Text>}</Text>
                            <Text style={styles.infoDetailLabel}>Dislikes: {(this.state.info.dislikes!=undefined && this.state.info.dislikes!=null) && <Text style={styles.infoDetail}>{this.state.info.dislikes}</Text>}</Text>
                            <Text style={styles.infoDetailLabel}>Additional Information: {(this.state.info.additionalInfo!=undefined && this.state.info.additionalInfo!=null) && <Text style={styles.infoDetail}>{this.state.info.additionalInfo}</Text>}</Text>
                        </View>
                    </View>

                    {
                        this.props.accountType === "parent" &&
                        <TouchableOpacity style={styles.icons} onPress={() => { this.setState({currentPage: "edit"}) }}>
                            <Icon name={"edit"} style={{
                                position: "absolute",
                                elevation: 13
                            }} size={28} color="white" />

                            <View style={{
                                backgroundColor: "cornflowerblue",
                                borderRadius: 27.5,
                                elevation: 6,
                                width: 50,
                                height: 50,
                                position: "absolute",
                                zIndex: 1,
                                overflow: "visible"
                            }} />
                        </TouchableOpacity>
                    }
                </View>
            );
        }
        else {
            return (
                <View style={{minHeight: Dimensions.get('window').height - Constants.statusBarHeight - 85}}>
                    <ScrollView contentContainerStyle={{backgroundColor:"blue"}}>
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
                    </ScrollView>

                    <TouchableOpacity style={[styles.icons, {right: 79}]} onPress={() => {
                        Alert.alert(
                            'Confirm Cancel',
                            'Are you sure you want to discard your changes?',
                            [
                                {text: 'Go Back'},
                                {text: 'Yes, Discard Changes', onPress: () => {
                                    this.setState({currentPage: "home"});
                                }},
                            ],
                        )
                    }}>
                        <FeatherIcon name={"x"} style={{
                            position: "absolute",
                            elevation: 13
                        }} size={28} color="white" />

                        <View style={{
                            backgroundColor: "red",
                            borderRadius: 27.5,
                            elevation: 6,
                            width: 50,
                            height: 50,
                            position: "absolute",
                            zIndex: 1,
                            overflow: "visible"
                        }} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.icons} onPress={() => {
                        Alert.alert(
                            'Confirm Changes',
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
                    }}>
                        <Icon name={"check"} style={{
                            position: "absolute",
                            elevation: 13
                        }} size={28} color="white" />

                        <View style={{
                            backgroundColor: "green",
                            borderRadius: 27.5,
                            elevation: 6,
                            width: 50,
                            height: 50,
                            position: "absolute",
                            zIndex: 1,
                            overflow: "visible"
                        }} />
                    </TouchableOpacity>
                </View>
            )
        }
    };
};

const styles = StyleSheet.create({
    infoCategoryLabel: {
        marginLeft: 10,
        marginTop: 18,
        marginBottom: 5,
        fontSize: 12,
        fontWeight: "300"
    },

    infoCategoryView: {
        width: Dimensions.get("window").width,
        backgroundColor: "white",
        elevation: 1,
        padding: 10
    },

    infoDetailLabel: {
        fontSize: 18,
        fontWeight: "500"
    },

    infoDetail: {
        fontSize: 15
    },

    icons: {
        position: "absolute",
        bottom: 15,
        right: 9,
        alignItems: "center",
        justifyContent: "center",
        width: 70,
        height: 70,
        zIndex: 1
    }
});
