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
    // this.style.width = `${this.width}px`
    // this.style.height = `${this.height}px`
    // this.containerId = this.getAttribute('id')

    // TODO: cardList is on table. store a internal _cardList to check for
    // changes on cardlest when needing to render()? no
    // OR use a Proxy when creating the cards? yes
    // this._cards = {}
    // this.cardList = []

    this.addEventListener('crdtrx-card-pileset', function (ev) {
      console.log('table pileset', ev.type, ev.composedPath())
      if (ev.detail.pileId !== this.id) {
        // card no longer in this pile
        const removedCard = this.removeCard(ev.detail.cardId)
        const cardPileRemovedCardEvent = new window.CustomEvent('crdtrx-pile-removecard', {
          bubbles: true,
          composed: true,
          detail: {
            cardEl: removedCard
          }
        })
        this.dispatchEvent(cardPileRemovedCardEvent)
      }
      // TODO: determine what pile that the card is going to?
      // If it is within a pile bounds then update card pile to that one and set the maxZIndex.
    }, false)
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

  addCard (props, surface) {
    const card = new Card(props, surface)
    this.areaSlot.appendChild(card)
    return card
  }

  removeCard (cardId) {
    const removedCard = this.areaSlot.removeChild(document.getElementById(cardId))
    return removedCard
  }

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
