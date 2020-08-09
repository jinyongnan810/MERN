import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profile'
import { useEffect } from 'react'
import Spinner from '../layout/Spinner'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { DashboardActions } from './DashboardActions'
import Experience from './Experience'
import Education from './Education'
import { deleteUser } from '../../actions/auth'

const Dashboard = ({
    auth: { user },
    profile: { loading, profile },
    getCurrentProfile,
    deleteUser
}) => {
    useEffect(() => {
        getCurrentProfile()
    }, [getCurrentProfile])

    if (loading && profile === null)
        return (
            <Spinner />
        )
    else {
        return (
            <Fragment>
                <h1 className="text-primary large">Dashboard</h1>
                <p className="lead">
                    <i className="fas fa-user"></i> Welcome,{user && user.name}
                </p>
                {profile === null ?
                    <Fragment>
                        <p>You have not yet set a profile.</p>
                        <Link to="/create-profile" className="btn btn-primary my-1">Create Profile</Link>
                    </Fragment>

                    :
                    <Fragment>
                        <DashboardActions />
                        <Experience experience={profile.experience} />
                        <Education education={profile.education} />
                        <div className="my-2">
                            <button className="btn btn-danger" onClick={e => deleteUser()}>delete user</button>
                        </div>
                    </Fragment>
                }
            </Fragment>
        )
    }
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteUser })(Dashboard)
