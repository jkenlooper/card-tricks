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
    this.footprint = shadowRoot.getElementById('footprint')

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

    this.addEventListener('crdtrx-card-pileset', function (ev) {
      console.log('table pileset', ev.type, ev.composedPath())
      if (ev.detail.pileId !== this.id) {
        // card no longer in this pile
        this.removeCard(ev.detail.cardId)
      }
      // TODO: determine what pile that the card is going to?
      // If it is within a pile bounds then update card pile to that one and set the maxZIndex.
    }, false)
  }

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback (attrName, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.render()
    }
  }

  // Reflect the prop with the attr
  get x () {
    return this.getAttribute('x') || 0
  }
  set x (val) {
    this.setAttribute('x', Math.round(val))
  }

  get y () {
    return this.getAttribute('y') || 0
  }
  set y (val) {
    this.setAttribute('y', Math.round(val))
  }

  get width () {
    return this.getAttribute('width') || 100
  }
  set width (val) {
    this.setAttribute('width', Math.round(val))
  }

  get height () {
    return this.getAttribute('height') || 100
  }
  set height (val) {
    this.setAttribute('height', Math.round(val))
  }

  render () {
    this.footprint.style.width = `${this.width}px`
    this.footprint.style.height = `${this.height}px`
    this.footprint.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`
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
    card.setAttribute('id', props.id)
    card.setAttribute('x', props.x)
    card.setAttribute('y', props.y)
    card.setAttribute('z', props.z)
    card.setAttribute('r', props.r)
    card.setAttribute('name', props.name)
    card.setAttribute('pile', props.pile)

    card.setAttribute('container', this.id)
    return this.appendCard(card)
  }
  appendCard (card) {
    this.areaSlot.appendChild(card)
    return card
  }

  removeCard (cardId) {
    const removedCard = this.areaSlot.removeChild(document.getElementById(cardId))
    const cardPileRemovedCardEvent = new window.CustomEvent('crdtrx-pile-removecard', {
      bubbles: true,
      composed: true,
      detail: {
        cardEl: removedCard
      }
    })
    this.dispatchEvent(cardPileRemovedCardEvent)
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
