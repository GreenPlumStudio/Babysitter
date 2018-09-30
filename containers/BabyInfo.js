import React, {Component} from 'React';
import { StyleSheet, Text, View } from 'react-native';

export default class BabyInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user
        };
    };

    render() {
        return (
            <View>
                <Text>This be the fking babyInfo page ya betch lol</Text>
                <Text>pls dont do cocaine ey cocaine ruin your brain ey</Text>
            </View>
        );
    };
};
