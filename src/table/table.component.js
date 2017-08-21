import crdtrxCard from '../card'
import crdtrxPile from '../pile'
// import {setTopZIndexForPile} from './cardListUtilities.js'
import template from './table.html'
import style from './table.css'

const html = `
<style>${style}</style>
${template}
`
const Card = window.customElements.whenDefined(crdtrxCard)
  .then(() => {
    return window.customElements.get(crdtrxCard)
  })

const Pile = window.customElements.whenDefined(crdtrxPile)
  .then(() => {
    return window.customElements.get(crdtrxPile)
  })

class Table extends window.HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html

    this.surface = shadowRoot.getElementById('surface')
    this.surfaceSlot = this.querySelector('[slot=surface]')
    this.hasInitialized = false
  }

  connectedCallback () {
    if (!this.hasInitialized) {
      // table depends on having these custom elements defined
      Promise.all([Card, Pile]).then(values => {
        console.log(values[0] === Card)
        console.log(values[1] === Pile)
        // Card = values.shift()
        // Pile = values.shift()
        this.init()
      })
    }
  }

  init () {
    this.hasInitialized = true
    const tableInitEvent = new window.CustomEvent('crdtrx-table-init', {
      bubbles: true,
      composed: true,
      detail: {
      }
    })
    this.dispatchEvent(tableInitEvent)

    this.render()
  }

  render () {
    /*
    this.debugEl.innerHTML = `
      <pre>${JSON.stringify(this.cardList, null, 2)}</pre>
    `
    */
  }

  static get name () {
    return 'crdtrx-table'
  }
}

export default Table
