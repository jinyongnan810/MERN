import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import moment from 'moment'

const ProfileExp = ({ profile: {
    experience
} }) => {
    return (
        <div className="profile-exp bg-white p-2">
            <h2 className="text-primary">Experience</h2>
            {experience.length === 0 ? <h4>No Experiences.</h4> :
                <Fragment>
                    {
                        experience.map(exp => (
                            <div key={exp._id}>
                                <h3 className="text-dark">{exp.company}</h3>
                                <p><Moment format="MMM YYYY">{moment.utc(exp.from)}</Moment> - {exp.current ? 'Current' : <Moment format="MMM YYYY">{moment.utc(exp.to)}</Moment>}</p>
                                {exp.title && <p><strong>Position: </strong>{exp.title}</p>}
                                {exp.description &&
                                    <p><strong>Description: </strong>{exp.description}</p>}
                            </div>
                        ))
                    }
                </Fragment>}

        </div>
    )
}

ProfileExp.propTypes = {
    profile: PropTypes.object.isRequired,
}

export default ProfileExp
