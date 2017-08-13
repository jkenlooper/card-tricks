const crdtrxCard = 'crdtrx-card'
const tableElement = document.getElementById('example-card-tricks-table')
const spotElement = document.getElementById('spot')

window.customElements.whenDefined(crdtrxCard)
  .then(() => {
    return window.customElements.get(crdtrxCard)
  })
  .then((Card) => {
    // Card is now defined and could be used to create card elements.

    // Delay setting impetus friction until after the initial transition. This way it can slide in to begin with.
    const cardList = document.querySelectorAll(crdtrxCard)
    cardList.forEach((card) => {
      // Changing the friction will reinit the impetus for the card. Any
      // non-number value, like false, will just use the default friction for
      // impetus.
      card.addEventListener('transitionend', finished, true)
      function finished (ev) {
        card.setAttribute('friction', true)
        card.removeEventListener('transitionend', finished)
      }
    })

    tableElement.addEventListener('crdtrx-card-xy', function (ev) {
      // Update the spot element position everytime the card is at a final position.
      updateSpotPosition(ev.detail.x, ev.detail.y)
    }, false)

  })

function updateSpotPosition (x, y) {
  spotElement.style.transform = `translate3d(${x}px, ${y}px, 0)`
}

// Stack all button example
document.getElementById('stack-all').addEventListener('click', function (ev) {
  const cardList = document.querySelectorAll(crdtrxCard)
  cardList.forEach((card, index) => {
    card.addEventListener('transitionend', finished, true)
    // transitionend event can be cancelled so use a fallback timeout that is
    // +100ms for the transition duration
    const timeoutId = window.setTimeout(finished, 400)
    // disable impetus
    card.removeAttribute('friction')

    // Set the new position which will transition
    card.x = 100
    card.y = 200
    card.z = index
    function finished (ev) {
      window.clearTimeout(timeoutId)
      // Add impetus back in
      card.setAttribute('friction', true)
      card.removeEventListener('transitionend', finished)
      updateSpotPosition(card.x, card.y)
    }
  })
})
