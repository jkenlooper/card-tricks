/* globals Redux */
import yo from 'yo-yo'

import {addCard, moveCard} from './modules/cards/actions.js'
import configureStore from './store'

// move
import {getCards} from './store'

const store = configureStore()

store.subscribe(() => {
  console.log(store.getState())
})
store.dispatch(addCard({
  id: 1,
  x: 10,
  y: 10
}))

// Component?
const el = list([], addCardHandler)
function list (items, addCardHandler) {
  const el = yo`<div id='testdiv' style='width: 400px;height: 400px;'>
  Cards
  <ul>
    ${items.map(function (item) {
      return yo`<li><crdtrx-card x="${item.x}"
          y="${item.y}"
          name="02h"
          id="${item.id}"
          z="${item.z}"
          container="testdiv"
          ></crdtrx-card></li>`
    })}
  </ul>
  <button onclick=${addCardHandler}>Add Card</button>
  </div>
  `
  el.addEventListener('crdtrx-card-xy', function (ev) {
    console.log('xy', ev.detail, ev.target.id)
    store.dispatch(moveCard({
      id: ev.target.id,
      x: ev.detail.x,
      y: ev.detail.y
    }))
  })
  return el
}

let nextId = 0
function addCardHandler (ev) {
  nextId = nextId + 1
  store.dispatch(addCard({
    id: nextId,
    x: ev.pageX,
    y: ev.pageY
  }))
}

// update?
function update (state) {
  const newList = list(state.cards, addCardHandler)
  yo.update(el, newList, {
    events: [
      'onclick',
      'crdtrx-card-xy'
    ]
  })
}

store.subscribe(() => {
  update(store.getState())
  console.log(getCards(store))
  // update(getCards(store))
})

document.body.appendChild(el)
