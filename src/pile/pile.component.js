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

    this.width = props.width
    this.height = props.height
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
  }

  static get name () {
    return 'crdtrx-pile'
  }

  drawTopCard () {
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
