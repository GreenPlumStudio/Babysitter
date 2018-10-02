import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, Image, /* SideMenu */ Animated, Easing } from 'react-native';
import { firebase, firestore } from './utils/firebase';
import { Constants } from 'expo';

import Messages from './containers/Messages';
import Reminders from './containers/Reminders';
import BabyInfo from './containers/BabyInfo';
import WelcomePage from './components/WelcomePage';
import LoginSignupPage from './components/LoginSignupPage';
import NavBar from './components/NavBar';
import SideMenuItems from './components/SideMenuItems';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      user: undefined,
      // loading: true,
      accountType: "",
      loginOrSignup: "login",
      currentPage: "messages",
      babysitterEmail: "",
      errMsg: "",
      oppositeUsers: [],

      // SideMenu
      percent: new Animated.Value(0),
      grayout: false
    };

    this.changeAccountType = this.changeAccountType.bind(this);
    this.signOut = this.signOut.bind(this);
    this.backToChooseAccountType = this.backToChooseAccountType.bind(this);
    this.setLoginOrSignup = this.setLoginOrSignup.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);

    // SideMenu
    this.showSideMenu = this.showSideMenu.bind(this);
    this.hideSideMenu = this.hideSideMenu.bind(this);
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

  addBabysitter() {
    firebase.auth().fetchProvidersForEmail(this.state.babysitterEmail)
    .then(providers => {
      if (providers.length === 0) {
        this.setState({errMsg: "No Such BabySitter Found!"});
      } else {
        firestore.collection("parentUsers").doc(firebase.auth().currentUser.uid).collection("babysitters").doc(this.state.babysitterEmail).update({
          "messages": {},
          "reminders": {},
          "babyInfo": {}
      });
      this.setState({errMsg: providers});

      }
    }).catch(() => {
      alert("Adding babysitter failed");
    });
    
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
              <SideMenuItems signOut={this.signOut} />
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

                  <TextInput style={{zIndex: 1}} value={this.state.babysitterEmail} onChangeText={text => this.setState({babysitterEmail: text})}/>
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
                      <Reminders user={user} />
                  }
                  {
                    this.state.currentPage === "babyInfo" &&
                      <BabyInfo user={user} />
                  }
                </View>
              </View>
            }
          </View>
        }
      </View>
    );
  };
};

const styles = StyleSheet.create({

});
