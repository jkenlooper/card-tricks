/* globals Redux */
import yo from 'yo-yo'

import cardTricksApp from './modules/reducers.js'

console.log('cardTricksApp', cardTricksApp({}, {type:'CARD'}))

import todoApp from './scratch/todo.js'


let store = Redux.createStore(todoApp)
store.subscribe(() => {
  console.log(store.getState())
})
store.dispatch({type: 'ADD_TODO', text: 'testing 123'})

const el = list([], addNumber, addTodo)

function list (items, addNumber, addTodo) {
  return yo`<div>
  Random Numbers
  <ul>
    ${items.map(function (item) {
      return yo`<li>${item}</li>`
    })}
    </ul>
    <button onclick=${addNumber}>Add Random Number</button>
    <button onclick=${addTodo}>Add Todo</button>
    </div>
    `
}

// Actions
// Follow FSA https://github.com/acdlite/flux-standard-action
function addNumber (ev) {
  store.dispatch({type: 'ADD_NUMBER', number: Math.random()})
}

function addTodo (ev) {
  store.dispatch({type: 'ADD_TODO', text: 'Just a test'})
}


function update (state) {
  // numbers.push(Math.random())

  console.log('update', state)
  const newList = list(state.randomNumbers, addNumber, addTodo)
  yo.update(el, newList)
}

store.subscribe(() => {
  console.log('subscribe', store.getState())
  update(store.getState())
})

document.body.appendChild(el)
