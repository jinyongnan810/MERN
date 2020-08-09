import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import moment from 'moment';
import { deleteEducation } from '../../actions/profile';
import { connect } from 'react-redux';
const Education = ({ education, deleteEducation }) => {
    const edus = education.map(edu => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className="hide-sm">{edu.degree}</td>
            <td className="hide-sm">
                <Moment format="YYYY/MM/DD">{moment.utc(edu.from)}</Moment> - {edu.current ? ' Now' : <Moment format="YYYY/MM/DD">{moment.utc(edu.to)}</Moment>}
            </td>
            <td><button className="btn btn-danger" onClick={e => deleteEducation(edu._id)}>delete</button></td>
        </tr>
    ))
    return (
        <Fragment>
            <h2 className="my-2">Experience Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>School</th>
                        <th className="hide-sm">Degree</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{edus}</tbody>
            </table>
        </Fragment>
    )
}

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired,
}

export default connect(null, { deleteEducation })(Education)
