const crdtrxCard = 'crdtrx-card'
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
        card.setAttribute('friction', false)
        card.removeEventListener('transitionend', finished)
      }
    })

    const tableElement = document.getElementById('example-card-tricks-table')
    const spotElement = document.getElementById('spot')
    tableElement.addEventListener('crdtrx-card-xy', function (ev) {
      // Update the spot element position everytime the card is at a final position.
      spotElement.style.transform = `translate3d(${ev.detail.x}px, ${ev.detail.y}px, 0)`
    }, false)

  })

document.getElementById('stack-all').addEventListener('click', function (ev) {
  const cardList = document.querySelectorAll(crdtrxCard)
  cardList.forEach((card, index) => {
    // disable impetus
    card.setAttribute('friction', undefined)

    // Set the new position which will transition
    card.x = 100
    card.y = 200
    card.z = index
    function finished (ev) {
      // Add impetus back in
      card.setAttribute('friction', true)
      card.removeEventListener('transitionend', finished)
    }
    card.addEventListener('transitionend', finished, true)
  })
})
