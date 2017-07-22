/* global HTMLElement */
import template from './card.html'
import { version, author } from '../package.json'
const html = `
<!--
Card ${version}
${author}
-->
${template}
`

export default 'm-card'

window.customElements.define('m-card', class extends HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html

    this.container = shadowRoot.querySelector('.m-card')
    this.elements = {
      x: shadowRoot.getElementById('x'),
      y: shadowRoot.getElementById('y')
    }

    this.model = {
      x: 0,
      y: 0
    }

    this.render()

    this.container.addEventListener('mousedown', this.handleMousedown.bind(this))
  }

  handleMousedown (ev) {
    console.log('tap', ev.pageX, ev.pageY)
    this.model.x = ev.pageX
    this.model.y = ev.pageY
    this.render()
  }

  // Fires when an instance was inserted into the document.
  connectedCallback () {}

  static get observedAttributes () {
    return [
      'zoom'
    ]
  }

  render () {
    this.elements.x.innerHTML = this.model.x
    this.elements.y.innerHTML = this.model.y
  }

})
