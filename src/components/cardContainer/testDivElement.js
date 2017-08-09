import template from './testdiv.html'

export default class TestDivElement {
  constructor (parentElement) {
    this.parentElement = parentElement
    this.parentElement.innerHTML = template
    this.testdivCardTemplate = parentElement.getElementById('testdiv-card')
  }

  addCard (card) {
    // ?
  }

  removeCard (cardId) {
    // ?
  }
}
