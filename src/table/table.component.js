import crdtrxCard from '../card'
import crdtrxPile from '../pile'
import cardsService from './cards.service.js'
import template from './table.html'
import style from './table.css'

let Card = window.customElements.whenDefined(crdtrxCard)
  .then(() => {
    return window.customElements.get(crdtrxCard)
  })

let Pile = window.customElements.whenDefined(crdtrxPile)
  .then(() => {
    return window.customElements.get(crdtrxPile)
  })

const html = `
<style>${style}</style>
${template}
`
/*
 * data down events up.
 * raise the state.
 */
/*
table
  state:
    cards

  cursor
    -
  pile - onClick

  card - onClick -> pile
*/
class Table extends window.HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html

    // Set the action for the add-card button
    /*
    shadowRoot.querySelectorAll('[data-card]').forEach((button) => {
      button.addEventListener('mousedown', this.handleMousedown.bind(this))
    })
    */
    this.addEventListener('mousedown', this.handleMousedown.bind(this))

    this.surface = shadowRoot.getElementById('surface')
    this.surfaceSlot = this.querySelector('[slot=surface]')
    this.count = 0
  }

  connectedCallback () {
    // table depends on having these custom elements defined
    Promise.all([Card, Pile]).then(values => {
      Card = values.shift()
      Pile = values.shift()
      this.init()
    })
  }

  init () {
    // let card = {id: '1', name: '01c', x: 30, y: 30, r: 0}
    // this.addCard(`card-${card.name}`, card.x, card.y)
    this.cardList = cardsService.getCardList()
    this.cardList.forEach((card) => {
      this.addCard(`card-${card.name}`, card.x, card.y)
    })
  }

  static get name () {
    return 'crdtrx-table'
  }

  handleMousedown (ev) {
    console.log('table tap', ev.target, ev.currentTarget)
    switch (ev.target.tagName.toLowerCase()) {
      case Table.name:
        this.addCard('card-02h', ev.pageX, ev.pageY)
        break
      case Pile.name:
        let card = ev.target.drawCard()
        this.addCard(`card-${card.id}`, ev.pageX, ev.pageY)
        break
      default:
    }

    // this.addCard(ev.target.getAttribute('data-card'), ev.pageX, ev.pageY)
  }

  nextId () {
    this.count += 1
    return this.count
  }

  addPile () {
    let pile = new Pile({
      width: 100,
      height: 100
      // TODO: set onClick handling here? Lifting state up
    })
    this.surfaceSlot.appendChild(pile)
  }

  addCard (side, x, y) {
    console.log('addCard', side, Card)
    console.log({
      id: this.nextId(),
      side: side,
      x: x,
      y: y,
      container: this.surface
    })
    let card = new Card({
      id: this.nextId(),
      side: side,
      x: x,
      y: y,
      container: this.surface
    })
    this.surfaceSlot.appendChild(card)
  }
}

export default Table
