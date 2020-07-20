import * as types from './types'
import uuid from 'uuid'

export const setAlert = (msg, alertType, timeout = 3000) => (dispatch) => {
    const id = uuid.v4()
    dispatch({
        type: types.SET_ALERT, payload: {
            id, msg, alertType
        }
    })
    setTimeout(() => {
        dispatch({
            type: types.REMOVE_ALERT, payload: id
        })
    }, timeout)
}