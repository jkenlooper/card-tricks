import {ADD_NUMBER, REMOVE_NUMBER} from '../constants.js'

// Action Creators

export function addNumber (number) {
  // const number = Math.random()
  return {type: ADD_NUMBER, payload: number}
}

export function removeNumber () {
  return {type: REMOVE_NUMBER}
}
