import React, { Component } from 'React';
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Keyboard
} from 'react-native';
import { firestore } from '../utils/firebase';
import { Constants } from 'expo';
import KeyboardSpacer from 'react-native-keyboard-spacer';

const msgsPgHeight = Dimensions.get('window').height - Constants.statusBarHeight - 85;

export default class Messages extends Component {
	constructor(props) {
		super(props);

		this.state = {
			user: this.props.user,
			textInput: ''
		};

		// this.all = firestore.collection("parentUsers").doc(this.props.accountType === "parent" ? this.props.user : this.props.oppositeUserUID)
		// .collection("babysitters").doc(this.props.accountType === "parent" ? this.props.oppositeUserUID : this.props.user);

		this.componentDidMount = this.componentDidMount.bind(this);
		this._keyboardDidShow = this._keyboardDidShow.bind(this);
		this.scrollToEnd = this.scrollToEnd.bind(this);
		this.addMessage = this.addMessage.bind(this);
	}

	componentDidMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		setTimeout(() => {
			this.scrollToEnd();
		}, 500);
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
	}

	_keyboardDidShow() {
        this.scrollToEnd();
	}

	scrollToEnd() {
		this.msgsScrollView.scrollToEnd();
	}

	addMessage() {
		if (this.state.textInput === '') {
			return;
		}
		let ar = this.props.msgs;
		let date = new Date().getTime();

		ar.push({
			sentBy: this.props.accountType === 'parent' ? true : false,
			text: this.state.textInput,
			time: date
		});

		firestore
			.collection('parentUsers')
			.doc(this.props.accountType === 'parent' ? this.props.user : this.props.oppositeUserUID)
			.collection('babysitters')
			.doc(this.props.accountType === 'parent' ? this.props.oppositeUserUID : this.props.user)
			.update({
				messages: ar
			})
			.then(() => {
				this.setState({ textInput: '' });
				this.scrollToEnd();
			});
	}

	render() {
		return (
            <React.Fragment>
                <View style={styles.msgsPgView}>
                    <ScrollView
                        ref={(msgsScrollView) => {
                            this.msgsScrollView = msgsScrollView;
                        }}
                    >
                        {this.props.msgs.map((m, i) => {
                            if (
                                (m.sentBy && this.props.accountType !== 'babysitter') ||
                                (!m.sentBy && this.props.accountType !== 'parent')
                            ) {
                                return (
                                    <View key={i}>
                                        <Text style={styles.self}>{m.text}</Text>
                                    </View>
                                );
                            } else {
                                return (
                                    <View key={i}>
                                        <Text style={styles.other}>{m.text}</Text>
                                    </View>
                                );
                            }
                        })}
                    </ScrollView>

                    {/* Send msg bar */}
                    <View style={styles.sendMsgBar}>
                        <TextInput
                            underlineColorAndroid="transparent"
                            style={{ backgroundColor: 'lightgray', flexBasis: 0, flexGrow: 1, paddingLeft: 7 }}
                            placeholder=" Type a message"
                            value={this.state.textInput}
                            onChangeText={(txt) => this.setState({ textInput: txt })}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.setState({ textInput: '' });
                                this.addMessage();
                            }}
                        >
                            <Text style={styles.buttonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardSpacer />
            </React.Fragment>
		);
	}
}

const styles = StyleSheet.create({
	msgsPgView: {
		flex: 1
	},

	self: {
		alignSelf: 'flex-end',
		borderRadius: 10,
		margin: 5,
		marginRight: 10,
		marginLeft: 35,
		padding: 8,
        backgroundColor: 'deepskyblue',
        overflow: 'hidden',
        elevation: 3
	},

	other: {
		alignSelf: 'flex-start',
		borderRadius: 10,
		margin: 5,
		marginLeft: 10,
		marginRight: 35,
		padding: 8,
        backgroundColor: 'lightgray',
        overflow: 'hidden',
        elevation: 3
	},

	sendMsgBar: {
		flexDirection: 'row',
		height: 50,
		zIndex: 1,
		elevation: 4,
		backgroundColor: 'purple'
	},

	sendMsgBarOnEditing: {
		flex: 1,
		flexDirection: 'row',
		height: 50,
		zIndex: 1,
		elevation: 4,
		backgroundColor: 'purple',
		marginBottom: Dimensions.get('window').height * 0.3
	},

	button: {
		backgroundColor: '#2196F3',
		borderRadius: 2,
		elevation: 4,
		height: 50,
		width: 50,
		justifyContent: 'center'
	},

	buttonText: {
		color: 'white',
		fontSize: 14,
		fontWeight: '500',
		padding: 8,
		textAlign: 'center'
	}
});