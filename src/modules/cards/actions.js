import {CARD_ADD, CARD_MOVE} from './constants.js'

// Actions
// Follow FSA https://github.com/acdlite/flux-standard-action

export function addCard (props) {
  return {
    type: CARD_ADD,
    payload: props
  }
}
export function moveCard (props) {
  return {
    type: CARD_MOVE,
    payload: props
  }
}
