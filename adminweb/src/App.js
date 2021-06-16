/* eslint-disable */

import React, { useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Home, Login } from './pages';


function App() {

  const [signPossible, setsignPossible] = useState(true);

  return(

    <Router>
      {signPossible ? 
      (<Route exact path='/' component={ Login } />) 
      : 
      ( setsignPossible(false), <Route path='/home' component={ Home } />) }
    </Router>
    
  );

}






































export default App;