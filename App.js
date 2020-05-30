import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as firebase from 'firebase';
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base';
import * as facebook from "expo-facebook";
import ENV from './env';

// Optionally import the services that you want to use
//import "firebase/auth";
//import "firebase/database";
//import "firebase/firestore";
//import "firebase/functions";
//import "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: ENV().apiKey,
  authDomain: ENV().authDomain,
  databaseURL: ENV().databaseURL,
  projectId: ENV().projectId,
  storageBucket: ENV().storageBucket,
  messagingSenderId: ENV().messagingSenderId,
  appId: ENV().appId,
  measurementId: ENV().measurementId
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle user state changes
  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signupUserHandler = (email, password) => {

    try {
      if (password.length <= 6) {
        alert('Please enter at least 6 characters');
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          onAuthStateChanged(user);
          console.log('User account created & signed in!');
          console.log('user', user);
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
    } catch (err) {
      console.log(err.toString());
    }

  }

  const loginUserHandler = (email, password) => {
    try {
      if (password.length <= 6) {
        alert('Please enter at least 6 characters');
        return;
      }
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          onAuthStateChanged(user);
          console.log('User signed in!');
          console.log('user', user);
        })
        .catch(error => {
          if (error.code === 'auth/wrong-password') {
            console.log('Wrong password.');
          }

          console.error(error);
        });
    } catch (err) {
      console.log(err.toString());
    }
  }

  const logout = () => {
    try {
      firebase.auth()
        .signOut()
        .then(() => console.log('User signed out!'));
    } catch (err) {
      console.log(err.toString());
    }
  }

  const loginWithFacebook = async () => {
    await facebook.initializeAsync('295121528542200');
    const { type, token, expires, permissions, declinedPermissions, } = await facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile'] });

    if (type === "success") {
      // Handle successful authentication here

      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      firebase.auth().signInWithCredential(credential)
        .then(user => {
          console.log('Facebook login success...');
          console.log('user', user);
        })
        .catch(error => {
          if (error.code === 'auth/account-exists-with-different-credential') {
            console.log('Email already associated with another account.');
          }

          console.error(error);
        });

    } else {
      // Handle errors here.
      console.log('Facebook login failed...');
    }

  }

  return (
    <Container style={styles.container}>

      {user ?
        <View style={styles.userInfo}>
          <Text>{user.email}</Text>
          <Button
            style={{ width: 100, marginTop: 10 }}
            full
            small
            onPress={logout}
          >
            <Text style={{ color: 'white' }}>Log out</Text>
          </Button>
        </View>
        :
        <View style={styles.userInfo}>
          <Text>Please login the user account</Text>
        </View>
      }

      <Form>

        <Item style={styles.item} floatingLabel>
          <Label>Email</Label>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={email => setEmail(email)}
          />
        </Item>

        <Item style={styles.item} floatingLabel>
          <Label>Password</Label>
          <Input
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={password => setPassword(password)}
          />
        </Item>

        <Button
          style={{ margin: 10 }}
          full
          rounded
          success
          onPress={() => loginUserHandler(email, password)}
        >
          <Text style={{ color: 'white' }}>Login</Text>
        </Button>

        <Button
          style={{ margin: 10 }}
          full
          rounded
          primary
          onPress={() => signupUserHandler(email, password)}
        >
          <Text style={{ color: 'white' }}>Sign Up</Text>
        </Button>

        <Button
          style={{ margin: 10 }}
          full
          rounded
          primary
          onPress={loginWithFacebook}
        >
          <Text style={{ color: 'white' }}>Login with Facebook</Text>
        </Button>

      </Form>
    </Container >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
  item: {
    paddingBottom: 10
  },
  userInfo: {
    margin: 10
  }
});
