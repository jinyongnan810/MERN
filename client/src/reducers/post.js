import * as types from '../actions/types'

const initilState = {
    posts: [],
    post: null,
    error: {},
    loading: true
}

export default (state = initilState, action) => {
    const { payload, type } = action
    switch (type) {
        case types.GET_POSTS:
            return {
                ...state,
                posts: payload,
                loading: false
            }
        case types.GET_POST:
            return {
                ...state,
                post: payload,
                loading: false
            }
        case types.ADD_POST:
            return {
                ...state,
                posts: [payload, ...state.posts],
                loading: false
            }
        case types.DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(p => p._id !== payload),
                loading: false
            }
        case types.POST_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
        case types.UPDATE_LIKES:
            return {
                ...state,
                posts: state.posts.map(p => {
                    if (p._id === payload.id) {
                        return { ...p, likes: payload.likes }
                    }
                    return p
                }),
                loading: false
            }
        case types.ADD_COMMENT:
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: payload
                },
                loading: false
            }
        case types.REMOVE_COMMENT:
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: state.post.comments.filter(comment => comment._id !== payload)
                },
                loading: false
            }
        default:
            return state
    }
}