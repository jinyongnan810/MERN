import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { removeComment } from '../../actions/post'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import moment from 'moment'

const CommentItem = ({ postId, comment: { _id, text, name, avatar, user, date }, auth, removeComment }) => {
    return (
        <div class="post bg-white p-1 my-1">
            <div>
                <Link to={`/profile/${user}`}>
                    <img
                        class="round-img"
                        src={avatar}
                        alt={name}
                    />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p class="my-1">
                    {text}
                </p>
                <p class="post-date">
                    Posted on {<Moment format="MM/DD/YYYY">{moment.utc(date)}</Moment>}
                </p>
                {user === auth.user._id && (
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={e => removeComment(postId, _id)}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>

        </div>
    )
}

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    auth: PropTypes.object.isRequired,
}
const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, { removeComment })(CommentItem)
