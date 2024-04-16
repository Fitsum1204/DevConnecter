import axios from "axios";
import { setAlert } from "./alert";

import {
    ACCOUNT_DELETED,
    CLEAR_PROFILE,
    GET_PROFILE,
    GET_PROFILES,
    GET_REPOS,
    PROFILE_ERROR,
    UPDATE_PROFILE
  
} from './types' 

//Get current users profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('https://devconnecter-backend.onrender.com/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg:err.response.statusText,status:err.response.status}
        });
        
    }
}

//Get all profile
export const getProfile = () => async dispatch => {
    dispatch({type: CLEAR_PROFILE})
    try {
        const res = await axios.get('https://devconnecter-backend.onrender.com/api/profile');
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg:err.response.statusText,status:err.response.status}
        });
        
    }
}
//Get profile by ID
export const getProfileById = user_id => async dispatch => {
    
    try {
        const res = await axios.get(`https://devconnecter-backend.onrender.com/api/profile/user/${user_id}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg:err.response.statusText,status:err.response.status}
        });
        
    }
}
//Get github repos
export const getGithubRepos = username => async dispatch => {
   
    try {
        const res = await axios.get(`https://devconnecter-backend.onrender.com/api/profile/github/${username}`);
        dispatch({
            type: GET_REPOS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: {msg:err.response.statusText,status:err.response.status}
        });
        
    }
}
//Create or update profile

export const createProfile = (FormData,edit=false)=> async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        } 
        const res = await axios.post('https://devconnecter-backend.onrender.com/api/profile',FormData,config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert(edit ? 'profile Update':'profile Created','success'))
        
    } catch (err) {
        const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

              dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
              });
    }
} 

//Add Experience 
export const addExpriance = (FormData ,history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        } 
        const res = await axios.put('https://devconnecter-backend.onrender.com/api/profile/experience',FormData,config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Added','success'))
        return res.data;
        
    } catch (err) {
        const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

              dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
              });
    }
}


//Add Education
export const addEducation = (FormData ,history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        } 
        const res = await axios.put('https://devconnecter-backend.onrender.com/api/profile/education',FormData,config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Added','success'))
        return res.data;
        
    } catch (err) {
        const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
      }

              dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status }
              });
    }
}


// Delete Experience

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`https://devconnecter-backend.onrender.com/api/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Removed','success'))
        return res.data;
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
          });
    }
}

// Delete Education

export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`https://devconnecter-backend.onrender.com/api/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Education Removed','success'))
        return res.data;
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
          });
    }
}


// Delete Account & Profile

export const delteAccount = () => async dispatch => {
    if(window.confirm('Are you sure?This can Not be undone!')){
    try {
        const res = await axios.delete(`https://devconnecter-backend.onrender.com/api/profile`);
        dispatch({type: CLEAR_PROFILE});
        dispatch({type: ACCOUNT_DELETED});
        dispatch(setAlert('Your account has been permanently deleted','success'))
        return res.data;
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
          });
    }
}
}