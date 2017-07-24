import Impetus from 'impetus'

import template from './card.html'
import { version, author } from '../../package.json'
import style from './card.css'

const html = `
<!--
Card ${version}
${author}
-->
<style>${style}</style>
${template}
`

export default class extends window.HTMLElement {
  constructor (props) {
    super()
    console.log('props', props)
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html

    // this.container = shadowRoot.querySelector('.m-card')
    this.elements = {
      x: shadowRoot.getElementById('x'),
      y: shadowRoot.getElementById('y')
    }

    this.state = {}
    this.x = this.x || props.x
    this.y = this.y || props.y
    this.container = props.container

    this.setImpetus(this)

    this.render()

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
      this.render()
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

  render () {
    this.elements.x.innerHTML = this.x
    this.elements.y.innerHTML = this.y
    this.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`
      /*
      rotate(${360 - piece.rotate === 360 ? 0 : 360 - piece.rotate}deg)`
      */
  }

  setImpetus (target) {
    console.log(this.container.clientWidth, this.container.clientHeight)
    console.log('impetus', target)

    this.impetus = new Impetus({
      source: target,
      initialValues: [Number(this.x), Number(this.y)],
      boundX: [0, this.container.clientWidth - 150],
      boundY: [0, this.container.clientHeight - 150],
      update: function (x, y) {
        console.log(target.x, x, target.y, y)
        target.x = x
        target.y = y
      }
    })
  }
        // target.impetus = target.impetus.destroy()

}
