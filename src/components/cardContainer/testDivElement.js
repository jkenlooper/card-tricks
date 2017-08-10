import template from './testdiv.html'

export default class TestDivElement {
  constructor (parentElement) {
    this.parentElement = parentElement
    this.parentElement.innerHTML = template
    this.listElement = this.parentElement.querySelector('[id=testdiv-list]')
    this.TestdivCardTemplate = parentElement.querySelector('[id=testdiv-card]')
  }

  addCards (cards) {
    this.listElement.innerHTML = ''
    cards.forEach(this.addCard.bind(this))
  }

  addCard (card) {
    console.log('addCard', card)
    const clonedElement = this.TestdivCardTemplate.content.cloneNode(true)
    const cardElement = clonedElement.querySelector('crdtrx-card')
    cardElement.setAttribute('id', card.id)
    cardElement.setAttribute('x', card.x)
    cardElement.setAttribute('y', card.y)
    cardElement.setAttribute('z', card.z)
    cardElement.setAttribute('r', card.r)
    cardElement.setAttribute('name', card.name)
    this.listElement.appendChild(clonedElement)
  }

  removeCard (cardId) {
    // ?
  }
}
