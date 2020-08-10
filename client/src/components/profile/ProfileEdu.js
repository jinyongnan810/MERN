import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import moment from 'moment'

const ProfileEdu = ({ profile: { education } }) => {
    return (
        <div className="profile-edu bg-white p-2">
            <h2 className="text-primary">Education</h2>
            {education.length === 0 ? <h4>No Educations.</h4> :
                <Fragment>
                    {
                        education.map((edu, index) => (
                            <div key={index}>
                                <h3>{edu.school}</h3>
                                <p><Moment format="MMM YYYY">{moment.utc(edu.from)}</Moment> - {edu.current ? 'Current' : <Moment format="MMM YYYY">{moment.utc(edu.to)}</Moment>}</p>
                                <p><strong>Degree: </strong>{edu.degree}</p>
                                <p><strong>Field Of Study: </strong>{edu.fieldofstudy}</p>
                                {edu.description &&
                                    <p><strong>Description: </strong>{edu.description}</p>}
                            </div>
                        ))
                    }
                </Fragment>}


        </div>
    )
}

ProfileEdu.propTypes = {
    profile: PropTypes.object.isRequired,
}

export default ProfileEdu
