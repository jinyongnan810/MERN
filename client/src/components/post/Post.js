import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useEffect } from 'react'
import { getPost } from '../../actions/post'
import Spinner from '../layout/Spinner'
import PostsItem from './PostsItem'
import { Link } from 'react-router-dom'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

const Post = ({ match, post: { post, loading }, getPost }) => {
    useEffect(() => {
        getPost(match.params.id)
    }, [getPost])
    return (
        <Fragment>
            {loading || post === null ? <Spinner></Spinner> :
                <Fragment>
                    <Link to="/posts" className="btn btn-light">Back to posts</Link>
                    <PostsItem post={post} showActions={false} />
                    <CommentForm postId={post._id} />
                    <div className="comments">
                        {post.comments.map(comment => <CommentItem postId={post._id} comment={comment} />)}
                    </div>
                </Fragment>}
        </Fragment>
    )
}

Post.propTypes = {
    getPost: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    post: state.post
})

export default connect(mapStateToProps, { getPost })(Post)
