import template from './card.html'
import { version, author } from '../../package.json'
import style from './card.css'

console.log('style', style)

const html = `
<!--
Card ${version}
${author}
-->
<style>${style}</style>
${template}
`

export default class extends HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html

    this.container = shadowRoot.querySelector('.m-card')
    this.elements = {
      x: shadowRoot.getElementById('x'),
      y: shadowRoot.getElementById('y')
    }

    this.state = {}
    this.x = this.x || 0
    this.y = this.y || 0

    this.render()

    this.container.addEventListener('mousedown', this.handleMousedown.bind(this))
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
      this.render()
    }
  }

  // Reflect the prop with the attr
  get x () {
    return this.getAttribute('x')
  }
  set x (val) {
    this.setAttribute('x', val)
  }

  get y () {
    return this.getAttribute('y')
  }
  set y (val) {
    this.setAttribute('y', val)
  }

  handleMousedown (ev) {
    console.log('tap', ev.pageX, ev.pageY)
  }

  // Fires when an instance was inserted into the document.
  connectedCallback () {}

  render () {
    this.elements.x.innerHTML = this.x
    this.elements.y.innerHTML = this.y
  }
}
