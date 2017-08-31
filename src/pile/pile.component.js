import fisherYates from './fisherYates.js'
import template from './pile.html'
import style from './pile.css'

const html = `
<style>${style}</style>
${template}
`

/**
 * A pile of elements
 * Attributes:
 * - type: neat, vertical, horizontal, as-is
 */
class Pile extends window.HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html

    // this.area = shadowRoot.getElementById('area')
    // this.areaSlot = this.querySelector('[slot=area]')
    // this.footprint = shadowRoot.getElementById('footprint')
    this.hasInitialized = false
  }

  // Fires when an instance was inserted into the document.
  connectedCallback () {
    if (!this.hasInitialized) {
      this.init()
    }
  }

  init () {
    this.hasInitialized = true
    // TODO: set initial next card position based on stackType
    this.next = {
      x: 0,
      y: 0,
      r: 0
    }
  }

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback (attrName, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.render()
    }
  }

  // Monitor these attributes for changes.
  static get observedAttributes () {
    return [
      'type',
      'multiplier'
    ]
  }

  // Reflect the prop with the attr
  get type () {
    return this.getAttribute('type') || 0
  }
  set type (val) {
    this.setAttribute('type', Math.round(val))
  }

  get multiplier () {
    return this.getAttribute('multiplier') || 0
  }
  set multiplier (val) {
    this.setAttribute('multiplier', Math.round(val))
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

  static positionForIndex (index, multiplier, type) {
    // based on stackType and index return the x,y,r.
    // use multiplier to exagarate the position
    const mx = Number(multiplier) || 0
    const idx = Number(index) || 0
    const pos = {}
    switch (type) {
      case 'neat':
        pos.x = Math.round((Math.random() * 15) * mx)
        pos.y = Math.round((Math.random() * 15) * mx)
        pos.r = Math.round(((Math.random() * 20) - 10) * mx)
        break
      case 'mess':
        pos.x = Math.round((Math.random() * 50) * mx)
        pos.y = Math.round((Math.random() * 50) * mx)
        pos.r = Math.round(((Math.random() * 40) - 20) * mx)
        break
      case 'shift':
        pos.x = Math.round(Math.sin(((Math.PI * 2) / 26) * idx) * 20 * mx)
        pos.y = Math.round(Math.cos(((Math.PI * 2) / 26) * idx) * 20 * mx)
        pos.r = Math.round(Math.random() * 4) - 2
        break
      case 'flower':
        pos.x = Math.round(Math.sin(((Math.PI * 2) / 26) * idx) * 20 * mx)
        pos.y = Math.round(Math.cos(((Math.PI * 2) / 26) * idx) * 20 * mx)
        pos.r = (idx * 6) * mx
        break
      case 'spiral':
        pos.x = 0
        pos.y = 0
        pos.r = (idx * 6) * mx
        break
      case 'vertical-mess':
        pos.x = Math.round(Math.random() * 10) - 5
        pos.y = Math.round((Math.round((Math.max(3.5, Math.random() * 5) + idx) * mx) + (idx * (5 * mx))) - mx)
        pos.r = Math.round(Math.random() * 16) - 8
        break
      case 'horizontal-mess':
        pos.x = Math.round((Math.round((Math.max(3.5, Math.random() * 5) + idx) * mx) + (idx * (5 * mx))) - mx)
        pos.y = Math.round(Math.random() * 10) - 5
        pos.r = Math.round(Math.random() * 16) - 8
        break
      case 'vertical':
        pos.x = Math.round(Math.random() * 10) - 5
        pos.y = Math.round((Math.round((5 + idx) * mx) + (idx * (5 * mx))) - mx)
        pos.r = Math.round(Math.random() * 4) - 2
        break
      case 'horizontal':
        pos.x = Math.round((Math.round((5 + idx) * mx) + (idx * (5 * mx))) - mx)
        pos.y = Math.round(Math.random() * 10) - 5
        pos.r = Math.round(Math.random() * 4) - 2
        break
      default: // perfection
        pos.x = 0
        pos.y = 0
        pos.r = 0
    }
    return pos
  }

  position (index) {
    return Pile.positionForIndex(index, this.multiplier, this.type)
  }

  stack (numberOfCards) {
    const list = []
    for (let index = 0; index < numberOfCards; index++) {
      list.push(Pile.positionForIndex(index, this.multiplier, this.type))
    }
    const pileStackEvent = new window.CustomEvent('crdtrx-pile-stack', {
      bubbles: true,
      composed: true,
      detail: {
        list: list
      }
    })
    this.dispatchEvent(pileStackEvent)
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
