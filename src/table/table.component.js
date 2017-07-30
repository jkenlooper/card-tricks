import crdtrxCard from '../card'
import crdtrxPile from '../pile'
import cardService from './card.service.js'
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
 * data down, events up.
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
    // this.addEventListener('mousedown', this.handleMousedown.bind(this))

    this.surface = shadowRoot.getElementById('surface')
    this.surfaceSlot = this.querySelector('[slot=surface]')
    this.count = 0
    this.debugEl = shadowRoot.getElementById('debug')

    this.addEventListener('crdtrx-card-xy', function (ev) {
      // console.log(ev.type, ev.composedPath())
      this.cardList[ev.target.id].x = ev.detail.x
      this.cardList[ev.target.id].y = ev.detail.y
      this.render()
    }, false)
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

    // Get all the cards for the table
    this.cardList = cardService.getCardList()

    // Only add the cards directly to the table that are not in a container
    // TODO: add el instead?
    Object.keys(this.cardList).filter((cardId) => {
      return !this.cardList[cardId].container
    })
    .forEach((cardId) => {
      this.addCard(this.cardList[cardId])
    })

    /*
    this.querySelectorAll(crdtrxPile).forEach((pile) => {
      pile.cardList = this.cardList
      pile.render()
    })
    */

    this.render()
  }

  addCard (props) {
    const newProps = Object.assign(props, {
      // id: this.nextId(),
      container: this.surface
    })
    // console.log('addCard', side, Card)
    const card = new Card(newProps)
    this.surfaceSlot.appendChild(card)
  }

  render () {
    this.debugEl.innerHTML = `
      <pre>${JSON.stringify(this.cardList, null, 2)}</pre>
    `
  }

  static get name () {
    return 'crdtrx-table'
  }

  nextId () {
    this.count += 1
    return this.count
  }

  addPile () {
    let pile = new Pile({
      // TODO: set onClick handling here? Lifting state up
    })
    this.surfaceSlot.appendChild(pile)
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

}

export default Table
