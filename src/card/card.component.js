import Impetus from 'impetus'
import debounce from 'debounce'

import template from './card.html'
// import { version, author } from '../../package.json'
import style from './card.css'

const html = `
<style>${style}</style>
${template}
`

// IDEA: use a <template> for each card type and have the template already on the page?

// Poker size card 2.5 x 3.5
const defaultCardWidth = 100
const defaultCardHeight = defaultCardWidth * 1.4
const CardBackTemplate = document.getElementById('card-back')

class Card extends window.HTMLElement {
  constructor (props, container) {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})

    shadowRoot.innerHTML = html
    const cardBack = CardBackTemplate.content.cloneNode(true)

    const CardTemplate = document.getElementById(`card-${props.name}`)
    const clonedCard = CardTemplate.content.cloneNode(true)
    shadowRoot.getElementById('card-front').appendChild(clonedCard)
    shadowRoot.getElementById('card-back').appendChild(cardBack)

    // this.container = shadowRoot.querySelector('.m-card')
    this.elements = {
      x: shadowRoot.getElementById('x'),
      y: shadowRoot.getElementById('y')
    }

    this.state = {}
    this.x = this.x || props.x
    this.y = this.y || props.y
    this.z = this.z || props.z
    this.id = props.id
    this.width = CardTemplate.getAttribute('width') || defaultCardWidth
    this.height = CardTemplate.getAttribute('height') || defaultCardHeight
    this.container = container

    shadowRoot.addEventListener('mousedown', this.handleMousedown.bind(this))
    shadowRoot.addEventListener('touchstart', this.handleMousedown.bind(this))

    shadowRoot.addEventListener('mouseup', this.handleMouseup.bind(this))
    shadowRoot.addEventListener('touchend', this.handleMouseup.bind(this))
  }

  // Monitor these attributes for changes.
  static get observedAttributes () {
    return [
      'x',
      'y',
      'z'
      // TODO: add pileId to card attribute?
    ]
  }

  static get name () {
    return 'crdtrx-card'
  }

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback (attrName, oldVal, newVal) {
    // console.log('attributeChangedCallback', attrName, oldVal, newVal)
    if (oldVal !== newVal) {
      this.render([attrName])
    }
  }

  // Fires when an instance was inserted into the document.
  connectedCallback () {
    this.init()

    this.render()
  }

  // Fires when element is removed from DOM
  disconnectedCallback () {
    this.destroy()
  }

  // Reflect the prop with the attr
  get x () {
    return this.getAttribute('x')
  }
  set x (val) {
    this.setAttribute('x', Math.round(val))
  }

  get y () {
    return this.getAttribute('y')
  }
  set y (val) {
    this.setAttribute('y', Math.round(val))
  }

  get z () {
    return this.getAttribute('z')
  }
  set z (val) {
    this.setAttribute('z', val)
  }

  set pile (val) {
    console.log('pile set', val)
    // Send event up so the pile can remove if pileId !== val
    const cardPileSetEvent = new window.CustomEvent('crdtrx-card-pileset', {
      bubbles: true,
      composed: true,
      detail: {
        pileId: val,
        cardId: this.id
      }
    })
    this.dispatchEvent(cardPileSetEvent)
  }

  handleMousedown (ev) {
    console.log('card mousedown', ev.pageX, ev.pageY)
    const cardMouseDownEvent = new window.CustomEvent('crdtrx-card-mousedown', {
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(cardMouseDownEvent)
  }

  handleMouseup (ev) {
    console.log('card mouseup', ev.pageX, ev.pageY)
    const cardMouseUpEvent = new window.CustomEvent('crdtrx-card-mouseup', {
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(cardMouseUpEvent)
  }

  init () {
    this.style.width = `${this.width}px`
    this.style.height = `${this.height}px`
    this.style.zIndex = this.z
    // TODO: Update bounds if container changes dimensions
    this.setImpetus(this)
  }

  /**
   * If attrs is empty then render all attrs. Otherwise, render only attrs listed.
   */
  render (attrs) {
    // this.elements.x.innerHTML = this.x
    // this.elements.y.innerHTML = this.y
    if (!attrs || attrs.includes('z')) {
      this.style.zIndex = this.z
    }
    if (!attrs || (attrs.includes('x') || attrs.includes('y'))) {
      this.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`
      /*
      rotate(${360 - this.r === 360 ? 0 : 360 - this.r}deg)`
      */
      if (this.impetus) {
        this.impetus.setValues(Number(this.x), Number(this.y))
      }
    }
  }

  destroy () {
    this.impetus = this.impetus.destroy()
    // Modern browsers shouldn't need to remove event listeners.
    // shadowRoot.addEventListener('mousedown', this.handleMousedown.bind(this))
  }

  setImpetus (target) {
    const debouncedUpdateXY = debounce(function updateXY (x, y) {
      // TODO: Isn't always the final event? the event is removed?
      const cardXYEvent = new window.CustomEvent('crdtrx-card-xy', {
        bubbles: true,
        composed: true,
        detail: {
          x: x,
          y: y
        }
      })
      target.dispatchEvent(cardXYEvent)
    }, 200)

    this.impetus = new Impetus({
      source: target,
      initialValues: [Number(this.x), Number(this.y)],
      boundX: [0, this.container.clientWidth - this.width],
      boundY: [0, this.container.clientHeight - this.height],
      update: function (x, y) {
        debouncedUpdateXY(Math.round(x), Math.round(y))
        target.x = x
        target.y = y
      }
    })
  }
}
export default Card
