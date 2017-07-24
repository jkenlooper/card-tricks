import Impetus from 'impetus'

import Card from '../card/card.component.js'
import template from './table.html'
import style from './table.css'

const html = `
<style>${style}</style>
${template}
`

export default class extends window.HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html


    shadowRoot.getElementById('add-card').addEventListener('mousedown', this.handleMousedown.bind(this))

    this.container = shadowRoot.getElementById('cards')
    // this.container.addEventListener('mousedown', this.handleMousedown.bind(this))
  }

  handleMousedown (ev) {
    console.log('table tap', ev.pageX, ev.pageY)
    // ev.target.x = ev.pageX
    // ev.target.y = ev.pageY
    let container = this

    this.addCard(ev.pageX, ev.pageY)

  }

  addCard (x, y) {
    let card = new Card({
      x: x,
      y: y,
      container: this.container
    })
    console.log('addCard', card)
    this.container.appendChild(card)
  }
}
