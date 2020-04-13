import React from 'react';
import { Switch, Route } from 'react-router-dom';
/**
 * Import all page components here
 */
import App from './App';
import Signin from './Signin';

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
 const Main = () => {
   return (
     <Switch>
       <Route exact path='/' component={App}></Route>
       <Route exact path='/signin' component={Signin}></Route>
     </Switch>
   );
 }

 export default Main;
