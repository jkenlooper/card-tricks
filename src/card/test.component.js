/* global HTMLElement */

const html = `
<!--
test
-->
<span>test</span>
`

export default class extends HTMLElement {
  constructor () {
    super()
    console.log('constructor', this.tagName)

    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = html
  }
}
