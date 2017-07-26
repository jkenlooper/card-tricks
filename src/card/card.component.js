import Impetus from 'impetus'

import template from './card.html'
// import { version, author } from '../../package.json'
import style from './card.css'

const html = `
<style>${style}</style>
${template}
`

// IDEA: use a <template> for each card type and have the template already on the page?

// Poker size card 2.5 x 3.5
const cardWidth = 100
const cardHeight = cardWidth * 1.4
const CardBackTemplate = document.getElementById('card-back')

export default class extends window.HTMLElement {
  constructor (props) {
    super()
    this.setAttribute('id', `card-${props.id}`)
    const shadowRoot = this.attachShadow({mode: 'open'})

    shadowRoot.innerHTML = html
    const cardBack = CardBackTemplate.content.cloneNode(true)

    const CardATemplate = document.getElementById(props.side)
    const cardA = CardATemplate.content.cloneNode(true)
    shadowRoot.getElementById('card-front').appendChild(cardA)
    shadowRoot.getElementById('card-back').appendChild(cardBack)

    // this.container = shadowRoot.querySelector('.m-card')
    this.elements = {
      x: shadowRoot.getElementById('x'),
      y: shadowRoot.getElementById('y')
    }

    this.state = {}
    this.x = this.x || props.x
    this.y = this.y || props.y
    this.container = props.container

    init.call(this)

    render.call(this)

    shadowRoot.addEventListener('mousedown', this.handleMousedown.bind(this))
  }

  // Monitor these attributes for changes.
  static get observedAttributes () {
    return [
      'x',
      'y'
    ]
  }

  // Fires when an attribute was added, removed, or updated.
  attributeChangedCallback (attrName, oldVal, newVal) {
    // console.log('attributeChangedCallback', attrName, oldVal, newVal)
    if (oldVal !== newVal) {
      render.call(this)
    }
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

  handleMousedown (ev) {
    console.log('tap', ev.pageX, ev.pageY)
  }

  // Fires when an instance was inserted into the document.
  connectedCallback () {}

}

function init () {
  this.style.width = `${cardWidth}px`
  this.style.height = `${cardHeight}px`
  // TODO: Update bounds if container changes dimensions
  setImpetus.call(this, this)
}

function setImpetus (target) {
  this.impetus = new Impetus({
    source: target,
    initialValues: [Number(this.x), Number(this.y)],
    boundX: [0, this.container.clientWidth - cardWidth],
    boundY: [0, this.container.clientHeight - cardHeight],
    update: function (x, y) {
      target.x = x
      target.y = y
    }
  })
}
// TODO: target.impetus = target.impetus.destroy()

function render () {
  this.elements.x.innerHTML = this.x
  this.elements.y.innerHTML = this.y
  this.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`
    /*
    rotate(${360 - this.r === 360 ? 0 : 360 - this.r}deg)`
    */
}
