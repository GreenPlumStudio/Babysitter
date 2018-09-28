import React from 'react';
import { StyleSheet, Text, View, Button, Dimensions, TextInput, TouchableOpacity, Image } from 'react-native';
import { firebase, firestore } from './utils/firebase';
import { Constants } from 'expo';

import Messages from './containers/Messages';
import Reminders from './containers/Reminders';
import Routine from './containers/Routine';
import WelcomePage from './components/WelcomePage';
import LoginSignupPage from './components/LoginSignupPage';
import SideMenu from './containers/SideMenu';

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      user: undefined,
      loading: true,
      accountType: "",
      loginOrSignup: "login",
      currentPage: "Reminders",
      babysitterEmail: "",
      errMsg: "",
      showSideMenu: false
    };

    this.backToChooseAccountType = this.backToChooseAccountType.bind(this);
    this.changeAccountType = this.changeAccountType.bind(this);
    this.setLoginOrSignup = this.setLoginOrSignup.bind(this);
    this.showSideMenu = this.showSideMenu.bind(this);
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({user});
      }
    });
  };

  changeAccountType(accountType) {
    this.setState({accountType});
  };

  signOut() {
    firebase.auth().signOut().then(() => {
      this.setState({user: undefined, accountType: "", loginOrSignup: "login"});
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
        firestore.collection("parentUsers").doc(firebase.auth().currentUser.uid).collection("babySitters").doc("test").update({
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

  showSideMenu() {
    this.setState({showSideMenu: true});
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
            {/* <SideMenu /> */}

            <View style={{height: 55}}>
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
    
            <View>
              <View>
                <Text>MESSAGES</Text>
              </View>
              <View>
                <Text>REMINDERS</Text>
              </View>
              <View>
                <Text>BABY INFO</Text>
              </View>
            </View>
    
            <View>
              {
                this.state.currentPage === "Messages" &&
                  <Messages user={user} />
              }
              {
                this.state.currentPage === "Reminders" &&
                  <Reminders user={user} />
              }
              {
                this.state.currentPage === "Routine" &&
                  <Routine user={user} />
              }
            </View>
    
            <View style={{height: 70, zIndex: 1}}>
              <Text>this is the main page</Text>
              <Button title="Sign Out" onPress={this.signOut.bind(this)} />
              <Text style={{zIndex: 1}}>add BabySitter Email</Text>
              <TextInput style={{zIndex: 1}} value={this.state.babysitterEmail} onChangeText={text => this.setState({babysitterEmail: text})}/>
              <Button styles={{zIndex: 1}} title="Add Babysitter" onPress={this.addBabysitter} />
            </View>
            
          </View>
        }
      </View>
    );
  };
};

const styles = StyleSheet.create({
  mainPage: {
    flex: 1
  },

  navBar: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    width: Dimensions.get("window").width
  },

  navButton: {
    padding: 2,
    borderBottomWidth: 2,
    borderBottomColor: "#89CFF0",
    width: Dimensions.get("window").width / 3
  },

  navButtonLabel: {
    color: "#89CFF0",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "bottom"
  }
});
