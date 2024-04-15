import React,{Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import Experienc from './Experienc'
import Education from './Education'
import { delteAccount, getCurrentProfile } from '../../action/profile'
import { Link } from 'react-router-dom'
import DashboardActions from './DashboardActions'
const Dashboard = ({getCurrentProfile, delteAccount,auth:{user},profile:{profile,loading}}) => {
    useEffect(() => {
        getCurrentProfile();
       },[getCurrentProfile]);
  return loading && profile === null ? <Spinner /> : <Fragment>
    <h1 className='large text-primary'>Dashboard</h1>
    <p className='lead'>
      <i className='fas fa-user'></i> Welcome {user && user.name}
    </p>
    { profile !== null ? <Fragment>
      <DashboardActions />
      <Experienc experience={profile.experience} />
      <Education education={profile.education} />
      <div className='my-2'>
        <button className='btn btn-danger' onClick={() => delteAccount()}>
          <i className='fas fa-user-minus'></i> Delete My Account
        </button>
      </div>
    </Fragment> : <Fragment>
      <p>You have not yet setup a profile,please add some info</p>
      <Link to='/create-profile' className='btn btn-primary my-1'>
        Create Profile
      </Link>
      </Fragment>}
  </Fragment>
  
}

Dashboard.propTypes = {
getCurrentProfile: PropTypes.func.isRequired,
delteAccount:PropTypes.func.isRequired,
auth: PropTypes.object.isRequired,
profile: PropTypes.object.isRequired
}
const mapStateToProps = (state) =>({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps,{getCurrentProfile,delteAccount})(Dashboard)
