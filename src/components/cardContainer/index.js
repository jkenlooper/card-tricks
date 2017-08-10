import TestDivElement from './testDivElement.js'
import {getCards} from '../../store'

export default class CardContainer {
  constructor (store, element) {
    this.store = store
    this.testDivElement = new TestDivElement(element)
  }

  update () {
    console.log(getCards(this.store))
    this.testDivElement.addCards(getCards(this.store))
  }

  init () {
    this.store.subscribe(this.update.bind(this))
  }
}
