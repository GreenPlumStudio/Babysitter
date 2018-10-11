import React, {Component} from 'React';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import {firebase, firestore} from '../utils/firebase';

export default class BabyInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            info: []
        };

        this.all = firestore.collection("parentUsers").doc(this.props.accountType === "parent" ? this.props.user : this.props.oppositeUserUID)
        .collection("babysitters").doc(this.props.accountType === "parent" ? this.props.oppositeUserUID : this.props.user);

        this.all.onSnapshot(doc => {
            let dataObj = doc.data().BabyInfo;
    
            this.setState({info: dataObj})
            
        });
    };

    render() {
        return (
            <View>{/*
                <Text>Baby Name: {this.state.info.firstName} {this.state.info.lastName}</Text>
                <Text>Date of Birth: {this.state.info.birthDay}</Text>
                <Text>Baby Medical Info: </Text>
                <FlatList 
                    data={this.state.info.medicalInfo}
                    renderItem={({item}) => <Text>item.key</Text>}
                />
                <Text>Likes: </Text>
                <Text>Dislikes: </Text>
                <Text>Additional Information/Caution: </Text>
            */}
                {this.props.accountType === "parent" &&
                    <View>
                        <Button title={"Add Baby Info"} onPress={this.editBabyInfo()}/>
                    </View>
                }
            </View>
        );
    };
};
