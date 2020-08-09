import axios from 'axios'
import { setAlert } from './alert'
import * as types from './types'

// get current user's profile
export const getCurrentProfile = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/profile/me')
        dispatch({
            type: types.GET_PROFILE,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: types.PROFILE_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
        setAlert('Error fetch user profile.')
    }
}

// create or change profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const res = await axios.post('/api/profile', formData, config)

        dispatch({
            type: types.GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"))

        // redirect to dashboard
        if (!edit) {
            history.push("/dashboard")
        }
    } catch (error) {
        const errors = error.response.data.errors
        if (errors) {
            errors.forEach(err => {
                dispatch(setAlert(err.msg, 'danger'))
            });
        }
        dispatch({
            type: types.PROFILE_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
    }
}

// add experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        formData.to = formData.current ? '' : formData.to
        const res = await axios.put('/api/profile/experience', formData, config)

        dispatch({
            type: types.UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert("Experience Added.", "success"))

        // redirect to dashboard
        history.push("/dashboard")
    } catch (error) {
        const errors = error.response.data.errs
        if (errors) {
            errors.forEach(err => {
                dispatch(setAlert(err.msg, 'danger'))
            });
        }
        dispatch({
            type: types.PROFILE_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
    }
}

// add education
export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        formData.to = formData.current ? '' : formData.to
        const res = await axios.put('/api/profile/education', formData, config)

        dispatch({
            type: types.UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert("Education Added.", "success"))

        // redirect to dashboard
        history.push("/dashboard")
    } catch (error) {
        const errors = error.response.data.errs
        if (errors) {
            errors.forEach(err => {
                dispatch(setAlert(err.msg, 'danger'))
            });
        }
        dispatch({
            type: types.PROFILE_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
    }
}

// remove experience
export const deleteExperience = (id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`)

        dispatch({
            type: types.UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert("Experience Removed.", "success"))
    } catch (error) {
        dispatch({
            type: types.PROFILE_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
    }
}

// remove education
export const deleteEducation = (id) => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`)

        dispatch({
            type: types.UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert("Education Removed.", "success"))
    } catch (error) {
        dispatch({
            type: types.PROFILE_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
    }
}
