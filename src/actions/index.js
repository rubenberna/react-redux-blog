import _ from 'lodash'
import jsonplaceholder from '../apis/jsonPlaceholder'

// using thunk middleware we can use async functions, which otherwise couldn't be processed in the actioncreator -- as it only accepts objects, but not functions
export const fetchPosts = () =>
    async dispatch => {
    const response = await jsonplaceholder.get('/posts')
    dispatch({ type: 'FETCH_POSTS', payload: response.data })
}

export const fetchUser = (id) => dispatch => _fetchUser(id, dispatch)

// _ (underscore) before a function indicates to other developers that it's a private function, and they shouldn't change it unless they know what they're doing
const _fetchUser = _.memoize(async(id, dispatch) => {
  const response = await jsonplaceholder.get(`/users/${id}`)
  dispatch({ type: 'FETCH_USER', payload: response.data })
})

// memoized function makes sure that we only call that function with the same argument once. We need to set it aside from the action, otherwise the memoized function would be called every time we call the action creator -- thus losing its purpose
