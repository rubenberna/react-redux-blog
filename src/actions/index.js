import _ from 'lodash'
import jsonplaceholder from '../apis/jsonPlaceholder'

// using thunk middleware we can use async functions, which otherwise couldn't be processed in the actioncreator -- as it only accepts objects, but not functions

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts()) // the await there makes sure we only move on once the result from fetchPosts comes
  // when we call an actioncreator inside of an actioncreator, we need to dispatch the result of that actioncreator

  // const userIds = _.uniq(_.map(getState().posts, 'userId'))
  // userIds.forEach(id => dispatch(fetchUser(id)))

  // getState() is a property from 'thunk'._uniq _.map belongs to lodash and returns only the uniq key-values that we define in the second element of _.map

// this is an alternative version of the code above using _.chain from lodash
  _.chain(getState().posts)
    .map('userId')
    .uniq()
    .forEach(id => dispatch(fetchUser(id)))
    .value() // chain won't exucate these steps until we put a value() -- means "execute"
}


export const fetchPosts = () =>
  async dispatch => {
  const response = await jsonplaceholder.get('/posts')
  dispatch({ type: 'FETCH_POSTS', payload: response.data })
}

export const fetchUser = id => async dispatch => {
  const response = await jsonplaceholder.get(`/users/${id}`)
  dispatch({ type: 'FETCH_USER', payload: response.data })
}

//MEMOIZED VERSION
// export const fetchUser = (id) => dispatch => _fetchUser(id, dispatch)

// _ (underscore) before a function indicates to other developers that it's a private function, and they shouldn't change it unless they know what they're doing

// const _fetchUser = _.memoize(async(id, dispatch) => {
//   const response = await jsonplaceholder.get(`/users/${id}`)
//   dispatch({ type: 'FETCH_USER', payload: response.data })
// })

// memoized function makes sure that we only call that function with the same argument once. We need to set it aside from the action, otherwise the memoized function would be called every time we call the action creator -- thus losing its purpose
