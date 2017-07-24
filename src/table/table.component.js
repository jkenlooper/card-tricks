import template from './table.html'
import style from './table.css'

const html = `
<style>${style}</style>
${template}
`

export default class extends HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html

    this.container = shadowRoot.querySelector('.m-table')
    this.container.addEventListener('mousedown', this.handleMousedown.bind(this))
  }

  handleMousedown (ev) {
    console.log('table tap', ev.pageX, ev.pageY)
    ev.target.x = ev.pageX
    ev.target.y = ev.pageY
  }
}
