import crdtrxCard from '../card'
import template from './pile.html'
import style from './pile.css'

let Card = window.customElements.whenDefined(crdtrxCard)
  .then(() => {
    return window.customElements.get(crdtrxCard)
  })

const html = `
<style>${style}</style>
${template}
`

/**
 * A pile of cards that will always have only one top card.
 * Properties:
 * - stackType: neat, vertical, horizontal, as-is
 * - faceup
 * - x, y, r, width, height
 */
class Pile extends window.HTMLElement {
  constructor (props) {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html

    // Set the action for the add-card button
    // shadowRoot.querySelectorAll('[data-card]').forEach((button) => {
    //   button.addEventListener('mousedown', this.handleMousedown.bind(this))
    // })

    this.area = shadowRoot.getElementById('area')
    this.areaSlot = this.querySelector('[slot=area]')

    this.width = this.getAttribute('width') || 100
    this.height = this.getAttribute('height') || 100
    this.count = 0
  }

  // Fires when an instance was inserted into the document.
  connectedCallback () {
    Promise.all([Card]).then(values => {
      Card = values.shift()
      this.init()
      this.render()
    })
  }

  init () {
    this.style.width = `${this.width}px`
    this.style.height = `${this.height}px`
    // this.containerId = this.getAttribute('id')

    // TODO: cardList is on table. store a internal _cardList to check for
    // changes on cardlest when needing to render()?
    // OR use a Proxy when creating the cards?
    this._cards = {}
    this.cardList = []
  }

  render () {
    // cycle through cardList for items that have changed from _cardlist
    /*
    this.cards.forEach((card) => {
      console.log('render card in pile', card)
    })
    */
  }

  static get name () {
    return 'crdtrx-pile'
  }

  /*
  get cards () {
    return this.cardList.filter((card) => {
      return card.container === this.containerId
    })
  }
  */

  /*
  addCard (side, x, y) {
    console.log('addCard to pile', side, Card)
    let card = new Card({
      id: this.nextId(),
      side: side,
      x: x,
      y: y,
      container: this.surface
    })
    this.surfaceSlot.appendChild(card)
  }
  */

  drawTopCard () {
    return this.cards[0]
  }

  acceptCards (cards) {
  }

  shuffle () {
  }

  // when transfering all cards in a pile to another pile
  removeAllCards () {
  }
}

export default Pile
