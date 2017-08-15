import fisherYates from './fisherYates.js'
import template from './pile.html'
import style from './pile.css'

const html = `
<style>${style}</style>
${template}
`

/**
 * A pile of elements
 * Properties:
 * - stackType: neat, vertical, horizontal, as-is
 */
class Pile extends window.HTMLElement {
  constructor () {
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

  render () {
    this.footprint.style.width = `${this.width}px`
    this.footprint.style.height = `${this.height}px`
    this.footprint.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`
  }

  static get name () {
    return 'crdtrx-pile'
  }

  shuffle (numberOfCards) {
    const list = fisherYates(numberOfCards)
    const pileShuffleEvent = new window.CustomEvent('crdtrx-pile-shuffle', {
      bubbles: true,
      composed: true,
      detail: {
        list: list
      }
    })
    this.dispatchEvent(pileShuffleEvent)
  }
}

export default Pile
