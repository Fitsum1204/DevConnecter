import React, { useState } from 'react'
import { Fragment } from 'react'
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import  { connect } from 'react-redux';
import { setAlert } from '../../action/alert';
import { register } from '../../action/auth';
import PropTypes from 'prop-types'

const Register = ({setAlert, register,isAuthenticated}) => {

const [formData,setFormData] = useState({
    name:'',
    email:'',
    password:'',
    password2:''
});

const {name,email,password,password2} = formData;
const onChange =e => setFormData({...formData,[e.target.name]:e.target.value})
const onSubmit = async (e) => {console.log(password,password2)
    e.preventDefault();
    if(password !== password2) {
     setAlert("passwords do not match",'danger');   
    } else {
      //console.log("success")
       register({name,email,password});

    }
  }
  //Redirect if Registered
  if(isAuthenticated) {
    return <Navigate  to="/dashboard" />
  }
return (
    <Fragment>
         <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e =>onSubmit(e)} >
        <div className="form-group">
          <input 
          type="text" 
          placeholder="Name" 
          name="name"
          onChange={e => onChange(e)}
          value={name}
         
          required />
        </div>
        <div className="form-group">
          <input 
          type="email" 
          placeholder="Email Address" 
          name="email"
          onChange={e => onChange(e)}
          value={email} required/>
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
        
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            onChange={e => onChange(e)}
             value={password}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            onChange={e => onChange(e)}
          value={password2}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  ) 
    
    
  
};
Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool
}
const mapStateToProps = state => ({
  isAuthenticated:state.auth.isAuthenticated
})
export default connect(mapStateToProps,{setAlert,register})(Register);
