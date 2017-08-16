import fisherYates from './fisherYates.js'
import template from './pile.html'
import style from './pile.css'

const html = `
<style>${style}</style>
${template}
`

/**
 * A pile of elements
 * Properties?:
 * - stackType?: neat, vertical, horizontal, as-is
 */
class Pile extends window.HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html

    // this.area = shadowRoot.getElementById('area')
    // this.areaSlot = this.querySelector('[slot=area]')
    // this.footprint = shadowRoot.getElementById('footprint')
  }

  // Fires when an instance was inserted into the document.
  connectedCallback () {
  }

  init () {
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
    /* TODO: should there be any styles for the pile set here?
    this.footprint.style.width = `${this.width}px`
    this.footprint.style.height = `${this.height}px`
    this.footprint.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`
    */
  }

  static get name () {
    return 'crdtrx-pile'
  }

  static randomListOfNumbers (count) {
    return fisherYates(count)
  }

  shuffle (numberOfCards) {
    const list = Pile.randomListOfNumbers(numberOfCards)
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
