import React ,{Fragment,useEffect} from 'react';
import './App.css';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import CreateProfile from './components/profile-form/CreateProfile';
import EditProfile from './components/profile-form/EditProfile';
import AddExperience from './components/profile-form/AddExperience';
import AddEducation from './components/profile-form/AddEducation';
import PrivateRoute from './components/routhing/PrivateRoute';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import NotFound from './components/layout/NotFound';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './action/auth';
//redux

import { Provider } from 'react-redux';
import store from './store';
if(localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())

  },[]);
return (
  <Provider store={store}>
  <Router>
    <Fragment>
      <Navbar/>
      <Routes>
      <Route exact path="/" Component={Landing}/>
      </Routes>
      <section className='container'>
        <Alert />
        <Routes>
          <Route exact path='/register' Component={Register}/>
          <Route exact path='/login' Component={Login}/>
          <Route exact path='/profiles' Component={Profiles}/>
          <Route exact path='/profile/:id' Component={Profile }/>
          <Route element= {<PrivateRoute component={Dashboard}/>} exact path="/dashboard" />
          <Route element= {<PrivateRoute component={CreateProfile}/>} exact path="/create-profile" />
          <Route element= {<PrivateRoute component={EditProfile}/>} exact path="/edit-profile" />
          <Route element= {<PrivateRoute component={AddExperience}/>} exact path="/add-experience" />
          <Route element= {<PrivateRoute component={AddEducation}/>} exact path="/add-education" />
          <Route element= {<PrivateRoute component={Posts}/>} exact path="/posts" />
          <Route element= {<PrivateRoute component={Post}/>} exact path="/posts/:id" />
          <Route path="/*" Component={NotFound} />
          </Routes>
           
          
       
      </section> 
    </Fragment>
  </Router>
  </Provider>
  
)};

export default App;
