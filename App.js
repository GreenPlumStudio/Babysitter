import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, Image, /* SideMenu~ */ Animated, Easing, /* ~SideMenu */ /* Ignore Warning~ */ YellowBox } from 'react-native';
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

// Ignore Warning
YellowBox.ignoreWarnings(['Setting a timer']);

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
      userUID: "",
      // loading: true,
      accountType: "",
      loginOrSignup: "login",
      currentPage: "messages",
      parentUID: "",
      babysitterUID: "",
      errMsg: "",
      oppositeUsers: [],
      oppositeUser: undefined,
      oppositeUserUID: "",
      reminders: [],

      addReminder: false,

      // SideMenu
      percent: new Animated.Value(0),
      grayout: false
    };

    this.componentWillMount = this.componentWillMount.bind(this);
    this.changeAccountType = this.changeAccountType.bind(this);
    this.signOut = this.signOut.bind(this);
    this.backToChooseAccountType = this.backToChooseAccountType.bind(this);
    this.setLoginOrSignup = this.setLoginOrSignup.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.openAddBabysitterPopup = this.openAddBabysitterPopup.bind(this);
    this.openAddReminderPopup = this.openAddReminderPopup.bind(this);
    this.addReminder = this.addReminder.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
    this.addBabysitter = this.addBabysitter.bind(this);
    this.addParent = this.addParent.bind(this);

    // SideMenu
    this.showSideMenu = this.showSideMenu.bind(this);
    this.hideSideMenu = this.hideSideMenu.bind(this);
  };

  componentWillReceiveProps(newProps) {
    this.setState({reminders: newProps.reminders});
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firestore.collection("parentUsers").doc(user.uid).get().then(parentUserDoc => {
          // if parent
          if (parentUserDoc.data()) {
            this.setState({user: parentUserDoc.data(), userUID: user.uid, accountType: "parent"});

            firestore.collection("parentUsers").doc(user.uid).collection("babysitters").get().then( col => {
              let oppositeUsers = new Array(col.size-1);
              
              let ix = 0;
              col.docs.forEach( oppositeUser => {
                if (oppositeUser.id !== "placeholder") {
                  oppositeUsers[ix] = oppositeUser.id;
                  ix += 1;
                }
              });

              if (oppositeUsers.length > 0) {
                firestore.collection("babysitterUsers").doc(oppositeUsers[0]).get().then( babysitterUserDoc => {
                  this.setState({oppositeUser: babysitterUserDoc.data(), oppositeUserUID: babysitterUserDoc.id, oppositeUsers});

                  // Fetch reminders
                  firestore.collection("parentUsers").doc(user.uid).collection("babysitters").doc(babysitterUserDoc.id).get().then( doc => {
                    let reminders = [];
        
                    doc.data().reminders.forEach( reminder => {
                        reminders = [...reminders, reminder];
                    })
        
                    this.setState({reminders});
                  }).catch( error => {
                    console.log(error);
                  });
                }).catch( error => {
                  console.log("Error fetching oppositeUsers[0]:\n" + error);
                });
              }
            });
          }
          // if babysitter
          else {
            firestore.collection("babysitterUsers").doc(user.uid).get().then(babysitterUserDoc => {
              this.setState({user: babysitterUserDoc.data(), userUID: user.uid, accountType: "babysitter"});
            });

            firestore.collection("babysitterUsers").doc(user.uid).collection("parents").get().then(col => {
              let oppositeUsers = [col.size-1];

              let ix = 0;
              col.docs.forEach( oppositeUser => {
                if (oppositeUser.id !== "placeholder") {
                  oppositeUsers[ix] = oppositeUser.id;
                  ix += 1;
                }
              });

              if (oppositeUsers.length > 0) {
                firestore.collection("parentUsers").doc(oppositeUsers[0]).get().then( parentUserDoc => {
                  this.setState({oppositeUser: parentUserDoc.data(), oppositeUserUID: parentUserDoc.id, oppositeUsers});

                  // Fetch reminders
                  firestore.collection("parentUsers").doc(parentUserDoc).collection("babysitters").doc(user.uid).get().then( doc => {
                    let reminders = [];
        
                    doc.data().reminders.forEach( reminder => {
                        reminders = [...reminders, reminder];
                    })
        
                    this.setState({reminders});
                  }).catch( error => {
                    console.log(error);
                  });
                }).catch( error => {
                  console.log("Error fetching oppositeUsers[0]:\n" + error);
                });
              }
            });
          }
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
        userUID: "",
        accountType: "",
        loginOrSignup: "login",
        currentPage: "messages",
        oppositeUsers: [],
        oppositeUser: undefined,
        oppositeUserUID: "",
        percent: new Animated.Value(0),
        grayout: false
      });
    }).catch(() => {
      alert("Sign out failed, please try again");
    });
  };

  openAddBabysitterPopup() {
    this.addBabysitterPopupDialog.show();
  };

  deleteReminder(nextProps) {
    

    if (nextProps == undefined) {
      this.setState({ reminders: [] });
   } else {
    this.setState({ reminders: nextProps });
   }

   console.log(this.state.reminders);
   console.log(this.state.userUID);
   console.log(this.state.oppositeUserUID);

   if (this.state.userUID == undefined) {
     console.log("not working1 ");
   } 
   if (this.state.oppositeUserUID == undefined) {
    console.log("not working2 ");
  }

  if (this.state.reminders == undefined) {
    console.log("not working2 ");
  }

    firestore.collection("parentUsers").doc(this.state.userUID).collection("babysitters").doc(this.state.oppositeUserUID).update({
      reminders: this.state.reminders
    });

  }

  openAddReminderPopup() {
    this.addReminderPopupDialog.show();
  };

  addReminder(title, text) {

    this.addReminderPopupDialog.dismiss();
    console.log(this.state.reminders);
    console.log("u troll");

    let ar = [];
    if (this.state.reminders == undefined) {
       ar = [{title, text}]
    } else {
       ar = [...this.state.reminders, {title, text}]
    }

    this.setState({reminders: ar});
    console.log(this.state.reminders);


    firestore.collection("parentUsers").doc(this.state.userUID).collection("babysitters").doc(this.state.oppositeUserUID).update({
        reminders: this.state.reminders
    });

    this.forceUpdate();
  }

  addBabysitter() {
    let babysitterUID = this.state.babysitterUID;
    firestore.collection("babysitterUsers").get().then( col => {
      let doesBabysitterExist = false;

      col.forEach( doc => {
        if (doc.id === babysitterUID) {
          doesBabysitterExist = true;
        }
      });

      if (!doesBabysitterExist) {
        this.setState({errMsg: "babysitterUID does not Exist"});
        return;
      }
    });
    
    firestore.collection("parentUsers").doc(this.state.userUID).collection("babysitters").doc(babysitterUID).set({
      "messages": [],
      "reminders": [],
      "babyInfo": {}
    });

    firestore.collection("babysitterUsers").doc(babysitterUID).collection("parents").doc(this.state.userUID).set({
      "exists": true
    });

    firestore.collection("babysitterUsers").doc(babysitterUID).get().then( doc => {
      this.setState({oppositeUser: doc.data(), oppositeUserUID: babysitterUID});
    });
    
    this.setState({babysitterUID: ""});
  };

  addParent() {
    let parentUID = this.state.parentUID;
    firestore.collection("parentUsers").get().then( col => {
      let doesParentExist = false;

      col.forEach( doc => {
        if (doc.id === parentUID) {
          doesParentExist = true;
        }
      });

      if (!doesParentExist) {
        this.setState({errMsg: "parentUID does not Exist"});
        return;
      }
    });
    
    firestore.collection("parentUsers").doc(parentUID).collection("babysitters").doc(this.state.userUID).set({
      "messages": [],
      "reminders": [],
      "babyInfo": {}
    });

    firestore.collection("babysitterUsers").doc(this.state.userUID).collection("parents").doc(parentUID).set({
      "exists": true
    });

    firestore.collection("parentUsers").doc(parentUID).get().then( doc => {
      this.setState({oppositeUser: doc.data(), oppositeUserUID: parentUID});
    });
    
    this.setState({parentUID: ""});
  };
  
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
    let isAccountTypeParent = this.state.accountType === "parent";
    
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
              <SideMenuItems signOut={this.signOut} openPopupDialog={this.openAddBabysitterPopup} user={this.state.user} userUID={this.state.userUID} accountType={this.state.accountType} />
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
                {
                  this.state.oppositeUsers.length == 0 &&
                  "Please add a " + (this.state.accountType === "parent" ? "Babysitter" : "Parent")
                }
                {
                  this.state.oppositeUsers.length > 0 &&
                  this.state.oppositeUser.firstName + " " + this.state.oppositeUser.lastName
                }
              </Text>

              <TouchableOpacity style={{position: "absolute", top: 20, right: 0}} /*onPress={this.showInfoMenu}*/>
                <Image style={{resizeMode: "contain", maxHeight: 20, right: -20}} source={require('./assets/antMenuIcon.png')} />
              </TouchableOpacity>
            </View>

            {
              this.state.oppositeUsers.length === 0 &&
              <View style={{zIndex: 0}}>
                <View>
                  <Text>To start, please add a {isAccountTypeParent ? "Babysitter" : "Parent"}</Text>

                  <TextInput placeholder={(isAccountTypeParent ? "Babysitter" : "Parent") + " UID"} style={{zIndex: 1}} value={isAccountTypeParent ? this.state.babysitterUID : this.state.parentUID} onChangeText={isAccountTypeParent ? text => this.setState({babysitterUID: text}) : text => this.setState({parentUID: text})}/>
                  <Button style={{zIndex: 1}} title={isAccountTypeParent ? "Add Babysitter" : "Add Parent"} onPress={isAccountTypeParent ? this.addBabysitter : this.addParent} />
                </View>
              </View>
            }

            {
              this.state.oppositeUsers.length > 0 &&
              <View style={{flex: 1, zIndex: 0}}>
                <NavBar currentPage={this.state.currentPage} changeCurrentPage={this.changeCurrentPage} />
        
                <View>
                  {
                    this.state.currentPage === "messages" &&
                      <Messages user={user} />
                  }
                  {
                    this.state.currentPage === "reminders" &&
                      <Reminders reminders = {this.state.reminders} popupDialog={this.openAddReminderPopup} deleteReminder={this.deleteReminder}/>
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
                <ReminderModal addReminder={(title,text) => this.addReminder(title,text)}/>
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
