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

    // Set the action for the add-card button
    shadowRoot.querySelectorAll('[data-card]').forEach((button) => {
      button.addEventListener('mousedown', this.handleMousedown.bind(this))
    })

    this.container = shadowRoot.getElementById('cards')
    this.count = 0
  }

  handleMousedown (ev) {
    console.log('table tap', ev.target, ev.pageX, ev.pageY)

    this.addCard(ev.target.getAttribute('data-card'), ev.pageX, ev.pageY)
  }

  nextId () {
    this.count += 1
    return this.count
  }

  addCard (side, x, y) {
    let card = new Card({
      id: this.nextId(),
      side: side,
      x: x,
      y: y,
      container: this.container
    })
    console.log('addCard', card)
    this.container.appendChild(card)
  }
}
