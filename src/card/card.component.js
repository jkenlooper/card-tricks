import Impetus from 'impetus'
import debounce from 'debounce'

import template from './card.html'
import style from './card.css'

const html = `
<style>${style}</style>
${template}
`

// Poker size card 2.5 x 3.5
const defaultCardWidth = 100
const defaultCardHeight = defaultCardWidth * 1.4

class Card extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({mode: 'open'})

    this.shadowRoot.innerHTML = html

    this.shadowRoot.addEventListener('mousedown', this.handleMousedown.bind(this))
    this.shadowRoot.addEventListener('touchstart', this.handleMousedown.bind(this))

    this.shadowRoot.addEventListener('mouseup', this.handleMouseup.bind(this))
    this.shadowRoot.addEventListener('touchend', this.handleMouseup.bind(this))
    this.hasInitialized = false
  }

  // Monitor these attributes for changes.
  static get observedAttributes () {
    return [
      'x',
      'y',
      'z',
      'r',
      'side',
      'friction'
      // TODO: add pileId to card attribute?
    ]
  }

  static get name () {
    return 'crdtrx-card'
  }

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback (attrName, oldVal, newVal) {
    // Skip rendering if it hasn't initialized yet
    if (!this.hasInitialized) {
      return
    }

    if (oldVal !== newVal) {
      // console.log('attributeChangedCallback', attrName, oldVal, newVal)
      if (attrName === 'friction') {
        // Friction attr has changed so destroy and optional create new impetus.
        if (this.impetus) {
          // this.impetus = this.impetus.destroy()
          this.destroy()
        }
        if (newVal) {
          this.setImpetus(this)
        }
      } else {
        this.render([attrName])
      }
    }
  }

  // Fires when an instance was inserted into the document.
  connectedCallback () {
    if (!this.hasInitialized) {
      this.init()
    }

    this.render()
  }

  // Fires when element is removed from DOM
  disconnectedCallback () {
    console.log('removed', this.id)
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

  get r () {
    return this.getAttribute('r')
  }
  set r (val) {
    this.setAttribute('r', Math.round(val))
  }

  get side () {
    return this.getAttribute('side')
  }
  set side (val) {
    this.setAttribute('side', val)
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
    // console.log('card mousedown', ev.pageX, ev.pageY)
    const cardMouseDownEvent = new window.CustomEvent('crdtrx-card-mousedown', {
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(cardMouseDownEvent)
  }

  handleMouseup (ev) {
    // console.log('card mouseup', ev.pageX, ev.pageY)
    const cardMouseUpEvent = new window.CustomEvent('crdtrx-card-mouseup', {
      bubbles: true,
      composed: true
    })
    this.dispatchEvent(cardMouseUpEvent)
  }

  init () {
    const cardBackElement = this.shadowRoot.getElementById('card-back')
    const cardFrontElement = this.shadowRoot.getElementById('card-front')
    // Set the front side based on name attr
    const CardTemplate = document.getElementById(`card-${this.getAttribute('name')}`)
    const clonedCard = CardTemplate.content.cloneNode(true)
    cardFrontElement.appendChild(clonedCard)

    // Set the optional back side based on back attr
    const backAttr = this.getAttribute('back')
    if (backAttr) {
      const CardBackTemplate = document.getElementById(`card-${backAttr}`)
      const clonedBackCard = CardBackTemplate.content.cloneNode(true)
      cardBackElement.appendChild(clonedBackCard)
    }

    this.width = CardTemplate.getAttribute('width') || defaultCardWidth
    this.height = CardTemplate.getAttribute('height') || defaultCardHeight
    this.containerEl = document.getElementById(this.getAttribute('container'))

    this.cardElement = this.shadowRoot.getElementById('card')

    this.style.width = cardFrontElement.style.width = cardBackElement.style.width = `${this.width}px`
    this.style.height = cardFrontElement.style.height = cardBackElement.style.height = `${this.height}px`
    this.style.zIndex = this.z
    // TODO: Update bounds if container changes dimensions
    if (this.getAttribute('friction')) {
      this.setImpetus(this)
    }
    this.hasInitialized = true
  }

  /**
   * If attrs is empty then render all attrs. Otherwise, render only attrs listed.
   */
  render (attrs) {
    if (!attrs || attrs.includes('z')) {
      this.style.zIndex = this.z
    }
    if (!attrs || (attrs.includes('x') || attrs.includes('y'))) {
      this.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`
      if (this.impetus) {
        this.impetus.setValues(Number(this.x), Number(this.y))
      }
    }
    if ((!attrs || attrs.includes('r')) && this.cardElement) {
      let rotate = Number(this.r) || 0
      rotate = 360 - rotate === 360 ? 0 : 360 - rotate
      this.cardElement.style.transform = `rotate(${rotate}deg)`
    }
    if (!attrs || (attrs.includes('side'))) {
      // flip the card
      if (this.side === 'back') {
        this.shadowRoot.getElementById('card-side').classList.add('is-flipped')
      } else {
        this.shadowRoot.getElementById('card-side').classList.remove('is-flipped')
      }
    }
  }

  destroy () {
    this.impetus = this.impetus.destroy()
    this.classList.remove('hasImpetus')
    // Modern browsers shouldn't need to remove event listeners.
  }

  setImpetus (target) {
    const debouncedUpdateXY = debounce(function updateXY (x, y) {
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

    this.classList.add('hasImpetus')
    this.impetus = new Impetus({
      source: target,
      initialValues: [Number(this.x), Number(this.y)],
      // Set friction 0 - 1.0 or undefined to use impetus default (0.92)
      friction: Number(this.getAttribute('friction')) || undefined,
      boundX: [0, this.containerEl.clientWidth - this.width],
      boundY: [0, this.containerEl.clientHeight - this.height],
      bounce: false,
      update: function (x, y) {
        debouncedUpdateXY(Math.round(x), Math.round(y))
        target.x = x
        target.y = y
      }
    })
  }
}
export default Card
