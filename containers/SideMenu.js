import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Animated, Easing, TouchableOpacity } from 'react-native';

const SideMenuItems = () => {
    <View>
		<Text>Open up App.js to start working on your app!</Text>
		<Text>Changes you make will automatically reload.</Text>
		<Text>Shake your phone to open the developer menu.</Text>
	</View>
};

export default class SideMenu extends React.Component {
    constructor() {
        super();

        this.state = {
            percent: new Animated.Value(0),
            grayout: false
        };

        this.showSideMenu = this.showSideMenu.bind(this);
        this.hideSideMenu = this.hideSideMenu.bind(this);
    };

    componentDidMount() {
        this.halfWidth = Dimensions.get('window').width * 0.5;
    };

    showSideMenu() {
        Animated.timing(this.state.percent, {
			toValue: 1,
			duration: 70,
			easing: Easing.ease
		}).start();

		this.setState({
			grayout: true
		});
    };

    hideSideMenu() {
		Animated.timing(this.state.percent, {
			toValue: 0,
			duration: 50,
			easing: Easing.ease
		}).start();

		this.setState({
			grayout: false
		});
    };
    
    render() {
        return (
            <View style={styles.sideMenu}>
				<Button title="SHOW" onPress={this.showSideMenu} />

				<Animated.View style={{
                    backgroundColor: 'red',
                    width: this.halfWidth,
                    height: Dimensions.get('window').height,
                    position: 'absolute',
                    left: -this.halfWidth,
                    top: 0,
                    zIndex: 2,
                    transform: [
                        {
                            translateX: this.state.percent.interpolate({
                                inputRange: [ 0, 1 ],
                                outputRange: [ 0, this.halfWidth ]
                            })
                        }
                    ]
                }}>
                    <SideMenuItems />
                </Animated.View>

				{
                    this.state.grayout &&
                        <TouchableOpacity style={{
                                backgroundColor: 'gray',
                                width: this.halfWidth * 2,
                                height: Dimensions.get('window').height,
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                zIndex: 1,
                                opacity: 0.4
                            }}
                            onPress={this.hideSideMenu}
                        />
                }
			</View>
        );
    };
};

const styles = StyleSheet.create({
    sideMenu: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
