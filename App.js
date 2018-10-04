import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, Image, /* SideMenu */ Animated, Easing } from 'react-native';
import { firebase, firestore } from './utils/firebase';
import { Constants } from 'expo';

import Messages from './containers/Messages';
import Reminders from './containers/Reminders';
import BabyInfo from './containers/BabyInfo';
import WelcomePage from './components/WelcomePage';
import LoginSignupPage from './containers/LoginSignupPage';
import NavBar from './components/NavBar';
import SideMenuItems from './components/SideMenuItems';

import ReminderModal from './components/ReminderModal';
import PopupDialog, { ScaleAnimation, DialogButton, DialogTitle} from 'react-native-popup-dialog';
import AddBabysitterModal from './components/AddBabysitterModal';


const addBabysitterPopup = new ScaleAnimation({
  toValue: 0, // optional
  useNativeDriver: true, // optional
})

const addReminderPopup = new ScaleAnimation({
  toValue: 0, // optional
  useNativeDriver: true, // optional
})

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      user: undefined,
      // loading: true,
      accountType: "",
      loginOrSignup: "login",
      currentPage: "messages",
      babysitterUid: "",
      errMsg: "",
      oppositeUsers: [],
      oppositeUser: "",

      addReminder: false,

      // SideMenu
      percent: new Animated.Value(0),
      grayout: false
    };

    this.changeAccountType = this.changeAccountType.bind(this);
    this.signOut = this.signOut.bind(this);
    this.backToChooseAccountType = this.backToChooseAccountType.bind(this);
    this.setLoginOrSignup = this.setLoginOrSignup.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.openAddBabysitterPopup = this.openAddBabysitterPopup.bind(this);
    this.openAddReminderPopup = this.openAddReminderPopup.bind(this);
    this.addReminder = this.addReminder.bind(this);

    // SideMenu
    this.showSideMenu = this.showSideMenu.bind(this);
    this.hideSideMenu = this.hideSideMenu.bind(this);
    this.addBabysitter = this.addBabysitter.bind(this);
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({user});

        firestore.collection("parentUsers").doc(user.uid).collection("babysitters").get().then((doc) => {
          let ar = [];
          doc.forEach(function(doc2) {
            if (doc2.id != "test") {
              ar.push({id: doc2.id, email: doc2.data().email});
              console.log(doc2.id)
            }
          })
          console.log(ar)

          if (ar.length >= 1) {
            this.setState({oppositeUsers: ar}) 
          }

          console.log(this.state.oppositeUsers);
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      
      }
    });

    // SideMenu
    this.halfWidth = Dimensions.get("window").width * 0.5;

    // setTimeout(()=>{
    //   this.showSideMenu();
    // }, 1000);
  };

  changeAccountType(accountType) {
    this.setState({accountType});
  };

  signOut() {
    firebase.auth().signOut().then(() => {
      this.setState({
        user: undefined,
        accountType: "",
        loginOrSignup: "login",
        currentPage: "messages",
        percent: new Animated.Value(0),
        grayout: false
      });
    }).catch(() => {
      alert("Sign out failed, please try again");
    });
  };

  openAddBabysitterPopup() {
    this.addBabysitterPopupDialog.show();
  }

  openAddReminderPopup() {
    this.addReminderPopupDialog.show();
  }

  addReminder(text) {
    firestore.collection("parentUsers").doc(firebase.auth().currentUser.uid).set({
        "reminderTest": text
    });

    console.log(text);
  }


  addBabysitter(babyUid) {

    this.setState({babysitterUid: babyUid});
    console.log(babyUid)
    console.log(this.state.user.uid);

    firestore.collection("babysitterUsers").get().then(function(querySnapshot) {
      let ret = false;

      querySnapshot.forEach(function(doc) {
          if (doc.id == babyUid) {
            ret = true;
          }

          
      });

      if (!ret) {
        this.setState({errMsg: "babyUid does not Exist"});
        return;
      }
    });
    
    firestore.collection("parentUsers").doc(this.state.user.uid).collection("babysitters").doc(babyUid).set({
      "messages": {},
      "reminders": {},
      "babyInfo": {}
    });

    firestore.collection("babysitterUsers").doc(babyUid).collection("parents").doc(this.state.user.uid).set({
      name: this.state.user.email
    });

    firestore.collection("babysitterUsers").get().doc(babyUid).then(function(querySnapshot) {
      
    });

    this.setState({oppositeUser: babyUid})
  }
  
  backToChooseAccountType() {
    this.setState({accountType: ""});
  };

  setLoginOrSignup(loginOrSignup) {
    this.setState({loginOrSignup});
  };

  /* SideMenu~ */
  showSideMenu() {
    Animated.timing(this.state.percent, {
      toValue: 1,
      duration: 130,
      easing: Easing.ease
    }).start();

		this.setState({
			grayout: true
    });
  };

  hideSideMenu() {
		Animated.timing(this.state.percent, {
			toValue: 0,
			duration: 130,
			easing: Easing.ease
		}).start();

		this.setState({
			grayout: false
		});
  };
  /* ~Side Menu */

  changeCurrentPage(newCurrentPage) {
    this.setState({currentPage: newCurrentPage});
  };

  render() {
    let user = this.state.user;
    
    return (
      <View style={{flex:1, backgroundColor: "lightpink", marginTop: Constants.statusBarHeight}}>
        {
          !user && this.state.accountType === "" &&
            <WelcomePage changeAccountType={this.changeAccountType} />
        }
        {
          !user && this.state.accountType !== "" &&
            <LoginSignupPage backToChooseAccountType={this.backToChooseAccountType} accountType={this.state.accountType} loginOrSignup={this.state.loginOrSignup} setLoginOrSignup={this.setLoginOrSignup} />
        }

        {
          user &&
          <View style={{flex: 1}}>
            {/* Side Menu~ */}
            <Animated.View style={{
              backgroundColor: "white",
              width: this.halfWidth * 1.4,
              height: Dimensions.get("window").height,
              position: "absolute",
              left: -this.halfWidth * 1.4,
              top: 0,
              zIndex: 3,
              transform: [
                {
                  translateX: this.state.percent.interpolate({
                    inputRange: [ 0, 1 ],
                    outputRange: [ 0, this.halfWidth * 1.4 ]
                  })
                }
              ]
            }}>
              <SideMenuItems signOut={this.signOut} openPopupDialog={this.openAddBabysitterPopup} />
            </Animated.View>

            {
              this.state.grayout &&
                <TouchableOpacity style={{
                    backgroundColor: "gray",
                    width: this.halfWidth * 2,
                    height: Dimensions.get("window").height,
                    position: "absolute",
                    left: 0,
                    top: 0,
                    zIndex: 2,
                    opacity: 0.4
                  }}
                  onPress={this.hideSideMenu}
                />
            }
            {/* ~Side Menu */}

            <View style={{height: 55, backgroundColor: "white", zIndex: 0}}>
              <TouchableOpacity style={{position: "absolute", top: 15}} onPress={this.showSideMenu}>
                <Image style={{resizeMode: "contain", maxHeight: 30, left: -30}} source={require('./assets/hamburgerMenuIcon.png')} />
              </TouchableOpacity>

              <Text style={{position: "absolute", top: 15, left: 70, fontWeight: "500", fontSize: 20}}>
                Babysitter/Family
              </Text>

              <TouchableOpacity style={{position: "absolute", top: 20, right: 0}} /*onPress={this.showInfoMenu}*/>
                <Image style={{resizeMode: "contain", maxHeight: 20, right: -20}} source={require('./assets/antMenuIcon.png')} />
              </TouchableOpacity>
            </View>

            {
              !this.state.oppositeUsers &&
              <View>
                <View>
                  <Text>To start, please add a Babysitter</Text>

                  <TextInput style={{zIndex: 1}} value={this.state.babysitterUid} onChangeText={text => this.setState({babysitterUid: text})}/>
                  <Button style={{zIndex: 1}} title="Add Babysitter" onPress={this.addBabysitter} />
                </View>
              </View>
            }

            {
              this.state.oppositeUsers &&
              <View style={{flex: 1, zIndex: 0}}>
                <NavBar currentPage={this.state.currentPage} changeCurrentPage={this.changeCurrentPage} />
        
                <View>
                  {
                    this.state.currentPage === "messages" &&
                      <Messages user={user} />
                  }
                  {
                    this.state.currentPage === "reminders" &&
                      <Reminders user={user} popupDialog={this.openAddReminderPopup} />
                  }
                  {
                    this.state.currentPage === "babyInfo" &&
                      <BabyInfo user={user} />
                  }
                </View>
              </View>
            }

            <PopupDialog
              overlayBackgroundColor={'green'}
              height={0.6}
              dialogAnimation={addBabysitterPopup}
              ref={(popupDialog) => { this.addBabysitterPopupDialog = popupDialog; }}
              dialogTitle={<DialogTitle title="Add a Babysitter" />}
            >
              <View style={{zIndex:1}}>
                <AddBabysitterModal addBabysitter = {(text) => this.addBabysitter(text)} />
              </View>
            </PopupDialog>

            <PopupDialog
              overlayBackgroundColor={'green'}
              height={0.6}
              dialogAnimation={addReminderPopup}
              ref={(popupDialog) => { this.addReminderPopupDialog = popupDialog; }}
              dialogTitle={<DialogTitle title="Add Reminder" />}
            >
              <View style={{zIndex:1}}>
                <ReminderModal addReminder={(text) => this.addReminder(text)}/>
              </View>
            </PopupDialog>

          </View>
        }
      </View>
    );
  };
};

const styles = StyleSheet.create({

});
