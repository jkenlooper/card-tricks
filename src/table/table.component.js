import crdtrxCard from '../card'
import crdtrxPile from '../pile'
import cardService from './card.service.js'
import {setTopZIndexForPile} from './cardListUtilities.js'
import template from './table.html'
import style from './table.css'

let Card = window.customElements.whenDefined(crdtrxCard)
  .then(() => {
    return window.customElements.get(crdtrxCard)
  })

let Pile = window.customElements.whenDefined(crdtrxPile)
  .then(() => {
    return window.customElements.get(crdtrxPile)
  })

const html = `
<style>${style}</style>
${template}
`
/*
 * data down, events up.
 * raise the state.
 */
/*
table
  state:
    cards

  cursor
    -
  pile - onClick

  card - onClick -> pile
*/
class Table extends window.HTMLElement {
  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html

    // Set the action for the add-card button
    /*
    shadowRoot.querySelectorAll('[data-card]').forEach((button) => {
      button.addEventListener('mousedown', this.handleMousedown.bind(this))
    })
    */
    this.addEventListener('mousedown', this.handleMousedown.bind(this))

    this.surface = shadowRoot.getElementById('surface')
    this.surfaceSlot = this.querySelector('[slot=surface]')
    this.count = 0
    this.debugEl = shadowRoot.getElementById('debug')

    this.addEventListener('crdtrx-card-xy', function (ev) {
      // console.log(ev.type, ev.composedPath())
      this.cardList[ev.target.id].x = ev.detail.x
      this.cardList[ev.target.id].y = ev.detail.y
      this.render()
    }, false)

    this.addEventListener('crdtrx-card-mousedown', function (ev) {
      // TODO: change the pile of the card to be undefined?
      // console.log(ev.type, ev.composedPath())
      this.cardList[ev.target.id].pile = undefined

      // Make this card the top most if it isn't already
      this.cardList[ev.target.id].z = setTopZIndexForPile(this.cardList, ev.target.id)

      this.render()
    }, false)

    this.addEventListener('crdtrx-card-mouseup', function (ev) {
      console.log('table mouseup', ev.type, ev.composedPath())
      // TODO: determine what pile that the card is going to?
      // If it is within a pile bounds then update card pile to that one and set the maxZIndex.
    }, false)

    this.addEventListener('crdtrx-pile-removecard', function (ev) {
      console.log('pile remove card', ev.type, ev.composedPath())
      // Add the cardEl to this surface
      this.surfaceSlot.appendChild(ev.detail.cardEl)
    }, false)
  }

  connectedCallback () {
    // table depends on having these custom elements defined
    Promise.all([Card, Pile]).then(values => {
      Card = values.shift()
      Pile = values.shift()
      this.init()
    })
  }

  init () {
    // Get all the cards for the table
    this.cardList = cardService.getCardList()

    // Only add the cards directly to the table that are not in a pile
    Object.keys(this.cardList).filter((cardId) => {
      return !this.cardList[cardId].pile
    })
    .forEach((cardId) => {
      const card = this.addCard(this.cardList[cardId])
      this.proxyCard(card)
    })

    this.querySelectorAll(crdtrxPile).forEach((pile) => {
      const pileId = pile.getAttribute('id')
      const pileCardIds = Object.keys(this.cardList).filter((cardId) => {
        const card = this.cardList[cardId]
        return card.pile === pileId
      })
      pileCardIds.forEach((cardId) => {
        const card = pile.addCard(this.cardList[cardId], this.surface)
        this.proxyCard(card)
      })
    })
    /*
    */

    this.render()
  }

  addCard (props) {
    /*
    const newProps = Object.assign(props, {
      // id: this.nextId(),
      container: this.surface
    })
    */
    // console.log('addCard', side, Card)
    const card = new Card(props, this.surface)
    this.surfaceSlot.appendChild(card)

    /*
    // Set a proxy on the card so state changes will update the card properties too
    this.cardList[props.id] = new Proxy(this.cardList[props.id], {
      set: function (target, prop, value, receiver) {
        card[prop] = value
        target[prop] = value
        return true
      }
    })
    */

    return card
  }

  /**
   * Proxy the card properties
   * @param {Card} card the card element
   */
  proxyCard (card) {
    // Set a proxy on the card so state changes will update the card properties too
    this.cardList[card.id] = new Proxy(this.cardList[card.id], {
      set: function (target, prop, value, receiver) {
        card[prop] = value
        target[prop] = value
        return true
      }
    })
  }

  render () {
    this.debugEl.innerHTML = `
      <pre>${JSON.stringify(this.cardList, null, 2)}</pre>
    `
  }

  static get name () {
    return 'crdtrx-table'
  }

  nextId () {
    this.count += 1
    return this.count
  }

  addPile () {
    let pile = new Pile({
      // TODO: set onClick handling here? Lifting state up
    })
    this.surfaceSlot.appendChild(pile)
  }

  handleMousedown (ev) {
    // Testing updates to the cardList data for card 2

    switch (ev.target.tagName.toLowerCase()) {
      case Table.name:
        console.log('table tap', ev.target.offsetTop, this.offsetTop, ev.pageY, ev.screenY)
        console.log(document.getElementById(this.cardList[57].pile).offsetTop)
        // this.cardList[2].x = ev.pageX
        // this.cardList[2].y = ev.pageY - (this.offsetTop)
        this.cardList[57].x = (ev.pageX - this.offsetLeft) - (document.getElementById(this.cardList[57].id).width / 2)
        this.cardList[57].y = (ev.pageY - this.offsetTop) - (document.getElementById(this.cardList[57].id).height / 2)
        this.render()
        break
      case Pile.name:
        // let card = ev.target.drawCard()
        // this.addCard(`card-${card.id}`, ev.pageX, ev.pageY)
        break
      default:
        break
    }

    // this.addCard(ev.target.getAttribute('data-card'), ev.pageX, ev.pageY)
  }
}

export default Table
