import {ADD_NUMBER, REMOVE_NUMBER} from '../constants.js'

const initialState = [0]

function randomNumbers (state = initialState, action) {
  switch (action.type) {
    case ADD_NUMBER:
      return state.concat([action.payload])
    case REMOVE_NUMBER:
      return state.slice(0, -1)
    default:
      return state
  }
}

export default randomNumbers
