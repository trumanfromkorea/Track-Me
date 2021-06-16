/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { Home } from '/'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import firebase from 'firebase'
import imgfile from './logo.png'

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyCf6G8TDQC4gML05q9VqajOnHlF9T2x66I",
  authDomain: "userapp-c55de.firebaseapp.com",
  projectId: "userapp-c55de",
  storageBucket: "userapp-c55de.appspot.com",
  messagingSenderId: "599352656145",
  appId: "1:599352656145:web:a7a442a399dd01e726ccb0"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
else {
  firebase.app();
}

function LoginHome() {
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputs, setInputs] = useState({ email:'', pw:'' })
  const { email, pw } = inputs;

  const db = firebase.firestore();

  function changeInputs(e) {
    const{ name, value } = e.target
    const nextInputs = { ...inputs, [name]: value }
    setInputs(nextInputs)
  }

  useEffect(() => {
    console.log('isAuthorized : ' + isAuthorized)
  }, [isAuthorized]) 

  return (

    <Router>

    {isAuthorized ? ( 
      <Route exact path='/' component={ Home }/>
    ) : 

    (<div className="loginScreen">

      <img className="imgSize" src={ imgfile } />

      <Form className="idForm" size={"huge"}>
        <Form.Field
          label='ID'
          control='input'
          placeholder='Enter your E-mail'
          value={ email }
          name='email'
          onChange={ changeInputs }
        />
      </Form>
      <br></br><br></br><br></br>
      <Form className="pwForm" size={"huge"}>
        <Form.Field
          label='Password'
          control='input'
          placeholder='Enter your PW'
          value={ pw }
          name='pw'
          type='Password'
          onChange={ changeInputs }
        />
      </Form>
        <Button className="submitButton" size={"large"} content='Sign In' secondary onClick={ () =>firebase.auth().signInWithEmailAndPassword(email, pw)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    var docRef = db.collection("adminInfo").doc(user.uid);
    docRef.get().then((doc) => {
        if (doc.exists) {
            setIsAuthorized(true)
        } else {
            // doc.data() will be undefined in this case
            alert('관리자가 아닙니다.');
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    // ...
  })
  .catch((error) => {
    //var errorCode = error.code;
    //var errorMessage = error.message;
    alert('Login failed!');
  }) }/>

    </div>)}


    </Router>
  );

}

export default LoginHome;