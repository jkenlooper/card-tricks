// {id: '1', name: '01c', x: 130, y: 330, r: 0, z: 1, pile: '1ee7'},
const initialState = {
  id: null,
  name: '',
  x: 1,
  y: 1,
  r: 0,
  z: 1,
  pile: null
}

function card (state = initialState, action) {
  switch (action.type) {
    case 'CARD_ADD':
      return Object.assign({}, state, {
        id: action.payload.id,
        name: action.payload.name,
        x: action.payload.x,
        y: action.payload.y,
        r: action.payload.r,
        z: action.payload.z,
        pile: action.payload.pile
      })
    default:
      return state
  }
}

export default card
