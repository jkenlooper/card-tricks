import {CARD_ADD, CARD_MOVE} from './constants.js'

const initialState = []

function cards (state = initialState, action) {
  switch (action.type) {
    case CARD_ADD:
      return state.concat([action.payload])
    case CARD_MOVE:
      return state.map((card) => {
        if (Number(card.id) === Number(action.payload.id)) {
          return Object.assign({}, card, action.payload)
        } else {
          return card
        }
      })
    default:
      return state
  }
}

export default cards
