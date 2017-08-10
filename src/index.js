import {addCard, moveCard} from './modules/cards/actions.js'
import configureStore from './store'

import {CardContainer} from './components'

const store = configureStore()

const appElement = document.getElementById('card-tricks-app')
const cardContainer = new CardContainer(store, appElement)

store.subscribe(() => {
  console.log(store.getState())
})
cardContainer.init()

store.dispatch(addCard({
  id: 1,
  x: 10,
  y: 10,
  name: '02h'
}))
