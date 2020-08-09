import axios from 'axios'
import * as types from './types'
import { setAlert } from './alert'
import setAuthToken from '../utils/setAuthToken'


// auth and load user
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token)
    }
    try {
        const res = await axios.get('/api/auth')
        dispatch({
            type: types.USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: types.AUTH_ERROR,
        })
    }
}

// register
export const register = ({ name, email, password }) => async (dispatch) => {
    const newUser = { name, email, password }
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/users', JSON.stringify(newUser), config)
        dispatch({ type: types.REGISTER_SUCCESS, payload: res.data })
        dispatch(loadUser())
    } catch (error) {
        dispatch({ type: types.REGISTER_FAIL })
        const errors = error.response.data.errors
        if (errors) {
            errors.forEach(err => {
                dispatch(setAlert(err.msg, 'danger'))
            });
        }
    }
}

// login
export const login = ({ email, password }) => async (dispatch) => {
    const user = { email, password }
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.post('/api/auth', JSON.stringify(user), config)
        dispatch({ type: types.LOGIN_SUCCESS, payload: res.data })
        dispatch(loadUser())
    } catch (error) {
        dispatch({ type: types.LOGIN_ERROR })
        const errors = error.response.data.errors
        if (errors) {
            errors.forEach(err => {
                dispatch(setAlert(err.msg, 'danger'))
            });
        }
    }
}

// logou
export const logout = () => (dispatch) => {
    dispatch({
        type: types.CLEAR_PROFILE
    })
    dispatch({
        type: types.LOGOUT
    })
}

// remove user
export const deleteUser = () => async dispatch => {
    try {
        await axios.delete(`/api/profile`)

        dispatch({
            type: types.CLEAR_PROFILE
        })
        dispatch({
            type: types.USER_DELETED
        })

        dispatch(setAlert("User is removed."))
    } catch (error) {
        dispatch({
            type: types.PROFILE_ERROR,
            payload: { 'msg': error.response.statusText, 'status': error.response.status }
        })
    }
}
