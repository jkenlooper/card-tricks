import cards from './cards'

export default function cardTricksApp (state = {}, action) {
  return {
    cards: cards(state.cards, action)
  }
}
