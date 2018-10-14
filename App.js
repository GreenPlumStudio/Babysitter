import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, Image, Keyboard, ImageBackground, /* SideMenu~ */ Animated, Easing, /* ~SideMenu */ /* Ignore Warning~ */ YellowBox } from 'react-native';
import { firebase, firestore } from './utils/firebase';
import { Constants } from 'expo';

import PopupDialog, { ScaleAnimation, DialogButton, DialogTitle} from 'react-native-popup-dialog';
import Spinner from 'react-native-loading-spinner-overlay';

import Messages from './containers/Messages';
import Reminders from './containers/Reminders';
import BabyInfo from './containers/BabyInfo';
import WelcomePage from './components/WelcomePage';
import LoginSignupPage from './containers/LoginSignupPage';
import NavBar from './components/NavBar';
import SideMenuItems from './components/SideMenuItems';
import ReminderModal from './components/ReminderModal';
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
      isLoading: true,
      user: undefined,
      userUID: "",
      // loading: true,
      accountType: "",
      loginOrSignup: "login",
      currentPage: "messages",
      parentUsername: "",
      parentUID: "",
      babysitterUsername: "",
      babysitterUID: "",
      errMsg: "",
      oppositeUsers: [],
      oppositeUser: undefined,
      oppositeUserUID: "",
      reminders: [],

      addReminder: false,

      // SideMenu
      percent: new Animated.Value(0),
      grayout: false,


      // babyInfo

      info: {},

      // messages:
      msgs: []
    };

    this.componentDidMount = this.componentDidMount.bind(this);
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
    this.switchCurOppositeUser = this.switchCurOppositeUser.bind(this);
    this.fetchReminders = this.fetchReminders.bind(this);

    // SideMenu
    this.showSideMenu = this.showSideMenu.bind(this);
    this.hideSideMenu = this.hideSideMenu.bind(this);

    this.editBabyInfo = this.editBabyInfo.bind(this);
    this.changeLoadingScreen = this.changeLoadingScreen.bind(this);
  };

  componentWillReceiveProps(newProps) {
    this.setState({reminders: newProps.reminders});
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firestore.collection("parentUsers").doc(user.uid).get().then( parentUserDoc => {
          // if parent
          if (parentUserDoc.data()) {
            this.setState({user: parentUserDoc.data(), userUID: user.uid, accountType: "parent"});

            firestore.collection("parentUsers").doc(user.uid).collection("babysitters").get().then( col => {
              let oppositeUsers = new Array(col.size-1);
              
              let ix = 0;
              col.forEach( oppositeUser => {
                if (oppositeUser.id !== "placeholder") {
                  let curOppositeUserData = oppositeUser.data();
                  let curOppositeUser = {
                    email: curOppositeUserData.email,
                    username: curOppositeUserData.username,
                    firstName: curOppositeUserData.firstName,
                    lastName: curOppositeUserData.lastName,
                  }
                  if (ix == 0) {
                    this.setState({oppositeUser: curOppositeUser, oppositeUserUID: oppositeUser.id});
                  }
                  oppositeUsers[ix] = curOppositeUser;
                  ix += 1;
                }
              });
              this.setState({oppositeUsers});

              if (oppositeUsers.length > 0) {
                // Fetch reminders
                this.fetchReminders();
              }

              // babyInfo

              this.all = firestore.collection("parentUsers").doc(this.state.accountType === "parent" ? this.state.userUID : this.state.oppositeUserUID)
              .collection("babysitters").doc(this.state.accountType === "parent" ? this.state.oppositeUserUID : this.state.userUID);

              this.all.get().then(doc => {
                let dataObj = doc.data().babyInfo;
    
                this.setState({info: dataObj});
              })
              .catch(err => {
                console.log(err);
              })

              this.all.onSnapshot( doc => {
                let dataObj = doc.data().messages;
                
                let msgs = dataObj.map( key => {
                    return {
                        sentBy: key.sentBy,
                        text: key.text,
                        time: key.time,
                        textInput: ""
                    };
                });
                this.setState({msgs});   
              });
            })
          }
          // if babysitter
          else {
            firestore.collection("babysitterUsers").doc(user.uid).get().then( babysitterUserDoc => {
              this.setState({user: babysitterUserDoc.data(), userUID: user.uid, accountType: "babysitter"});

              firestore.collection("babysitterUsers").doc(user.uid).collection("parents").get().then( col => {
                let oppositeUsers = new Array(col.size-1);
                
                let ix = 0;
                col.forEach( oppositeUser => {
                  if (oppositeUser.id !== "placeholder") {
                    let curOppositeUserData = oppositeUser.data();
                    let curOppositeUser = {
                      email: curOppositeUserData.email,
                      username: curOppositeUserData.username,
                      firstName: curOppositeUserData.firstName,
                      lastName: curOppositeUserData.lastName,
                    }
                    if (ix == 0) {
                      this.setState({oppositeUser: curOppositeUser, oppositeUserUID: oppositeUser.id});
                    }
                    oppositeUsers[ix] = curOppositeUser;
                    ix += 1;
                  }
                });
                this.setState({oppositeUsers});
  
                if (oppositeUsers.length > 0) {
                  // Fetch reminders
                  this.fetchReminders();
                }

                // babyInfo
  
                this.all = firestore.collection("parentUsers").doc(this.state.accountType === "parent" ? this.state.userUID : this.state.oppositeUserUID)
                .collection("babysitters").doc(this.state.accountType === "parent" ? this.state.oppositeUserUID : this.state.userUID);
  
                this.all.get().then(doc => {
                  let dataObj = doc.data().babyInfo;
      
                  this.setState({info: dataObj});
                })
                .catch(err => {
                  console.log(err);
                })
  
                this.all.onSnapshot( doc => {
                  let dataObj = doc.data().messages;
                  
                  let msgs = dataObj.map( key => {
                      return {
                          sentBy: key.sentBy,
                          text: key.text,
                          time: key.time,
                          textInput: ""
                      };
                  });
                  this.setState({msgs});   
                });
              })
            });
          }
        });
      }
    });

    // SideMenu
    this.halfWidth = Dimensions.get("window").width * 0.5;

    setTimeout(()=>{
      this.setState({isLoading: false});
    }, 4000);
  };

  fetchReminders() {
    let isAccountTypeParent = this.state.accountType === "parent";
    firestore.collection("parentUsers").doc(isAccountTypeParent ? this.state.userUID : this.state.oppositeUserUID).collection("babysitters").doc(isAccountTypeParent ? this.state.oppositeUserUID : this.state.userUID).get().then( doc => {
      this.setState({reminders: doc.data().reminders});
    })
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
        errMsg: "",
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

    firestore.collection("parentUsers").doc(this.state.userUID).collection("babysitters").doc(this.state.oppositeUserUID).update({
      reminders: this.state.reminders
    });
  };

  openAddReminderPopup() {
    this.addReminderPopupDialog.show();
  };

  addReminder(title, text) {
    this.addReminderPopupDialog.dismiss();

    let ar = [];
    if (this.state.reminders == undefined) {
      ar = [{title, text}];
    } else {
      ar = this.state.reminders;
      ar.push({title, text});
    }

    this.setState({reminders: ar});

    firestore.collection("parentUsers").doc(this.state.userUID).collection("babysitters").doc(this.state.oppositeUserUID).update({
        reminders: this.state.reminders
    });
  };

  editBabyInfo(name, birthDate, allergies, diseases, other, likes, dislikes, additionalInfo) {

    this.setState({isLoading: true});
    let all = firestore.collection("parentUsers").doc(this.state.accountType === "parent" ? this.state.userUID : this.state.oppositeUserUID)
    .collection("babysitters").doc(this.state.accountType === "parent" ? this.state.oppositeUserUID : this.state.userUID);

    console.log(likes, dislikes);

    this.setState({
        info: {
            name: name,
            birthDate: birthDate,
            allergies: allergies,
            diseases: diseases,
            other: other,
            likes: likes,
            dislikes: dislikes,
            additionalInfo: additionalInfo,
        }
    });

    all.update({
        babyInfo: {
            name: name,
            birthDate: birthDate,
            allergies: allergies,
            diseases: diseases,
            other: other,
            likes: likes,
            dislikes: dislikes,
            additionalInfo: additionalInfo,
        }
    }).then(() => {
      this.setState({currentPage: "reminders"});
      this.setState({currentPage: "babyInfo"});
      this.setState({isLoading: false});
    }).catch(err => {
      this.setState({isLoading: false, errMsg: err});
      alert("Could not update baby info. Please try again at a different time.");
    })
  }

  changeLoadingScreen(bool) {
    this.setState({isLoading: bool});
  }

  addBabysitter(babysitterUsername) {
    // user is a parent
    firestore.collection("babysitterUsernameToUID").get().then( col => {
      col.forEach( doc => {
        if (doc.id === babysitterUsername) {
          this.setState({babysitterUID: doc.data().uid});
        }
      });

      let babysitterUID = this.state.babysitterUID;

      if (!babysitterUID) {
        this.setState({errMsg: "Babysitter Username does not exist"});
        return;
      }

      let user = this.state.user;
      let userUID = this.state.userUID;
      firestore.collection("babysitterUsers").doc(babysitterUID).get().then( babysitterDoc => {
        let babysitterDocData = babysitterDoc.data();

        firestore.collection("parentUsers").doc(userUID).collection("babysitters").doc(babysitterUID).set({
          "messages": [],
          "reminders": [],
          "babyInfo": [],
          "email": babysitterDocData.email,
          "username": babysitterUsername,
          "firstName": babysitterDocData.firstName,
          "lastName": babysitterDocData.lastName
        });

        let babysitter = {
          email: babysitterDocData.email,
          username: babysitterUsername,
          firstName: babysitterDocData.firstName,
          lastName: babysitterDocData.lastName
        };

        this.state.oppositeUsers.push(babysitter);
  
        firestore.collection("babysitterUsers").doc(babysitterUID).collection("parents").doc(userUID).set({
          "email": user.email,
          "username": user.username,
          "firstName": user.firstName,
          "lastName": user.lastName
        });

        this.setState({oppositeUser: babysitterDocData, oppositeUserUID: babysitterUID});

        this.setState({babysitterUsername: "", babysitterUID: ""});
  
        Keyboard.dismiss();
        this.addBabysitterPopupDialog.dismiss(); 
      });
    });
  };

  addParent(parentUsername) {
    // user is a babysitter
    firestore.collection("parentUsernameToUID").get().then( col => {
      col.forEach( doc => {
        if (doc.id === parentUsername) {
          this.setState({parentUID: doc.data().uid});
        }
      });

      let parentUID = this.state.parentUID;

      if (!parentUID) {
        this.setState({errMsg: "Parent Username does not exist"});
        return;
      }

      let user = this.state.user;
      let userUID = this.state.userUID;
      firestore.collection("parentUsers").doc(parentUID).get().then( parentDoc => {
        let parentDocData = parentDoc.data();

        firestore.collection("parentUsers").doc(parentUID).collection("babysitters").doc(userUID).set({
          "messages": [],
          "reminders": [],
          "babyInfo": {},
          "email": user.email,
          "username": user.username,
          "firstName": user.firstName,
          "lastName": user.lastName
        });

        let parent = {
          email: parentDocData.email,
          username: parentDocData.username,
          firstName: parentDocData.firstName,
          lastName: parentDocData.lastName
        };

        this.state.oppositeUsers.push(parent);
  
        firestore.collection("babysitterUsers").doc(userUID).collection("parents").doc(parentUID).set({
          "email": parentDocData.email,
          "username": parentDocData.username,
          "firstName": parentDocData.firstName,
          "lastName": parentDocData.lastName
        });

        this.setState({oppositeUser: parentDocData, oppositeUserUID: parentUID});

        this.setState({parentUsername: "", parentUID: ""});
  
        Keyboard.dismiss();
        this.addBabysitterPopupDialog.dismiss(); 
      });
    });
  };

  switchCurOppositeUser(oppositeUsername) {
    let oppositeAccountType = this.state.accountType === "parent" ? "babysitter" : "parent";
    firestore.collection(oppositeAccountType + "UsernameToUID").doc(oppositeUsername).get().then( doc => {
      let oppositeUserUID = doc.data().uid;
      firestore.collection(oppositeAccountType + "Users").doc(oppositeUserUID).get().then( oppositeUserDoc => {
        this.setState({
          oppositeUser: oppositeUserDoc.data(),
          oppositeUserUID
        });
        this.fetchReminders();
        this.hideSideMenu();

        this.changeCurrentPage("reminders");
        this.changeCurrentPage("messages");
      });
    });
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
      let hasOppositeUsers = this.state.oppositeUsers.length > 0;
      
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
                <SideMenuItems signOut={this.signOut} openPopupDialog={this.openAddBabysitterPopup} user={this.state.user} username={this.state.user.username} accountType={this.state.accountType} oppositeUsers={this.state.oppositeUsers} switchCurOppositeUser={this.switchCurOppositeUser} sideMenuWidth={this.halfWidth * 1.4} />
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
              
              {/* Top Menu Bar~ */}
              <ImageBackground source={require("./assets/topMenuBarBackground.png")} style={{height: hasOppositeUsers ? 85 : 55, zIndex: 0}}>
                <View>
                  <TouchableOpacity style={{position: "absolute", top: 15}} onPress={this.showSideMenu}>
                    <Image style={{resizeMode: "contain", maxHeight: 30, left: -30}} source={require("./assets/hamburgerMenuIcon.png")} />
                  </TouchableOpacity>

                  <Text style={{position: "absolute", top: 15, left: 70, fontWeight: "500", fontSize: 20, color: "#f8f8ff"}}>
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
                    <Image style={{resizeMode: "contain", maxHeight: 20, right: -20}} source={require("./assets/antMenuIcon.png")} />
                  </TouchableOpacity>
                </View>
                
                {
                  hasOppositeUsers &&
                  <NavBar currentPage={this.state.currentPage} changeCurrentPage={this.changeCurrentPage} />
                }
              </ImageBackground>
              {/* ~Top Menu Bar */}

              {
                !hasOppositeUsers &&
                <View style={{zIndex: 0}}>
                  <View>
                    <Text>To start, please add a {isAccountTypeParent ? "Babysitter" : "Parent"}</Text>

                    <TextInput placeholder={(isAccountTypeParent ? "Babysitter" : "Parent") + " Username"} style={{zIndex: 1}} value={isAccountTypeParent ? this.state.babysitterUsername : this.state.parentUsername} onChangeText={isAccountTypeParent ? text => this.setState({babysitterUsername: text}) : text => this.setState({parentUsername: text})}/>
                    <Text>{this.state.errMsg}</Text>
                    <Button style={{zIndex: 1}} title={isAccountTypeParent ? "Add Babysitter" : "Add Parent"} onPress={isAccountTypeParent ? () => {this.addBabysitter(this.state.babysitterUsername)} : () => {this.addParent(this.state.parentUsername)}} />
                  </View>
                </View>
              }

              {
                hasOppositeUsers &&
                <View style={{flex: 1, zIndex: 0, height: Dimensions.get("window").height - 85}}>
                  {
                    this.state.currentPage === "messages" &&
                    <Messages msgs={this.state.msgs} user={this.state.userUID} accountType={this.state.accountType} oppositeUserUID={this.state.oppositeUserUID} />
                  }
                  {
                    this.state.currentPage === "reminders" &&
                    <Reminders reminders={this.state.reminders} popupDialog={this.openAddReminderPopup} deleteReminder={this.deleteReminder} accountType={this.state.accountType} />
                  }
                  {
                    this.state.currentPage === "babyInfo" &&
                    <BabyInfo info={this.state.info} editBabyInfo={this.editBabyInfo} accountType={this.state.accountType} />
                  }
                </View>
              }

              <PopupDialog
                overlayBackgroundColor={"lightblue"}
                height={0.6}
                dialogAnimation={addBabysitterPopup}
                ref={(popupDialog) => { this.addBabysitterPopupDialog = popupDialog; }}
                dialogTitle={<DialogTitle title={this.state.accountType === "parent" ? "Add a Babysitter" : "Add a Parent"} />}
              >
                <View style={{zIndex:1}}>
                  <AddBabysitterModal accountType={this.state.accountType} addParent={this.addParent} addBabysitter={this.addBabysitter} />
                </View>
              </PopupDialog>

              <PopupDialog
                overlayBackgroundColor={"lightblue"}
                height={0.6}
                dialogAnimation={addReminderPopup}
                ref={(popupDialog) => { this.addReminderPopupDialog = popupDialog; }}
                dialogTitle={<DialogTitle title="Add Reminder" />}
              >
                <View style={{zIndex:1}}>
                  <ReminderModal addReminder={this.addReminder}/>
                </View>
              </PopupDialog>

            </View>
          }


          <View style={{justifyContent: "center", alignItems: "center"}}>
            <Spinner textContent={"Loading..."} textStyle={{color: '#FFF'}} visible={this.state.isLoading} animation="fade" overlayColor="#2657a5" />
          </View>
        </View>
      );
    };
};

const styles = StyleSheet.create({

});
