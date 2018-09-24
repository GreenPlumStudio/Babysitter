import React, {Component} from 'React';
import { StyleSheet, Text, View, Button } from 'react-native';
import { firebase, firestore } from '../utils/firebase';
import ReminderModal from '../components/ReminderModal';
import PopupDialog, { ScaleAnimation, DialogButton, DialogTitle} from 'react-native-popup-dialog';

const scaleAnimation = new ScaleAnimation({
    toValue: 0, // optional
    useNativeDriver: true, // optional
  })

export default class Reminders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user,
            addReminder: false
        };
        this.addReminder = this.addReminder.bind(this);
    };

    addReminder(text) {
        firestore.collection("parentUsers").doc(firebase.auth().currentUser.uid).set({
            "test": text
        });
    }

    render() {
        return (
            <View styles={{zIndex: 1}}>
                <Text>This be the fking reminders page ya betch lol</Text>
                <Text>hey</Text>
                <Button styles={{zIndex: 1}} title="Add a Reminder" onPress={() => {this.popupDialog.show();}} />
                <PopupDialog
                    haveOverlay={true}
                    overlayBackgroundColor={'green'}
                    height={0.6}
                    dialogAnimation={scaleAnimation}
                    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
                    dialogTitle={<DialogTitle title="Add Reminder" />}

                >
                    <View style={{zIndex:3}}>
                        <ReminderModal addReminder={(text) => this.addReminder(text)}/>
                    </View>
                </PopupDialog>
            </View>
        );
    };

};
