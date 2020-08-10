import * as types from './types'
import axios from 'axios'
import { setAlert } from './alert'
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts')
        dispatch({
            type: types.GET_POSTS,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: types.POST_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
        setAlert('Error fetch posts.')
    }
}

export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`)
        dispatch({
            type: types.GET_POST,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: types.POST_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
        setAlert('Error fetch post.')
    }
}

export const deletePost = postId => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/${postId}`)
        dispatch({
            type: types.DELETE_POST,
            payload: postId
        })
        dispatch(setAlert('Post Removed.', 'success'))
    } catch (error) {
        dispatch({
            type: types.POST_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
        setAlert('Error delete post.')
    }
}

export const addPost = formData => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post(`/api/posts`, formData, config)
        dispatch({
            type: types.ADD_POST,
            payload: res.data
        })
        dispatch(setAlert('Post Created.', 'success'))
    } catch (error) {
        dispatch({
            type: types.POST_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
        setAlert('Error create post.')
    }
}

export const addLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`)
        dispatch({
            type: types.UPDATE_LIKES,
            payload: { id: postId, likes: res.data }
        })
    } catch (error) {
        dispatch({
            type: types.POST_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
        setAlert('Error fetch posts.')
    }
}

export const removeLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`)
        dispatch({
            type: types.UPDATE_LIKES,
            payload: { id: postId, likes: res.data }
        })
    } catch (error) {
        dispatch({
            type: types.POST_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
        setAlert('Error fetch posts.')
    }
}

export const addComment = (id, formData) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post(`/api/posts/comment/${id}`, formData, config)
        dispatch({
            type: types.ADD_COMMENT,
            payload: res.data
        })
        dispatch(setAlert('Comment Created.', 'success'))
    } catch (error) {
        dispatch({
            type: types.POST_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
        setAlert('Error create comment.')
    }
}
export const removeComment = (id, comment_id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/comment/${id}/${comment_id}`)
        dispatch({
            type: types.REMOVE_COMMENT,
            payload: comment_id
        })
        dispatch(setAlert('Comment Removed.', 'success'))
    } catch (error) {
        dispatch({
            type: types.POST_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
        setAlert('Error remove comment.')
    }
}