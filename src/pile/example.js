const crdtrxPile = 'crdtrx-pile'
const exampleContainerElement = document.getElementById('example-container')
const examplePile1 = document.getElementById('example-pile-1')

window.customElements.whenDefined(crdtrxPile)
  .then(() => {
    return window.customElements.get(crdtrxPile)
  })
  .then((Pile) => {
    // Pile is now defined and could be used to create pile elements.

    // Listen for the shuffle event on a pile
    exampleContainerElement.addEventListener('crdtrx-pile-shuffle', shuffle, true)
    function shuffle (ev) {
      const list = ev.detail.list
      const divListInPile = ev.target.querySelectorAll('.example-div')
      divListInPile.forEach((div) => {
        console.log(div)
        div.style.zIndex = list.shift()
      })
    }

    // Set shuffle button action
    const shuffleButton = document.getElementById('shuffle')
    if (shuffleButton) {
      shuffleButton.addEventListener('click', function handleClickShuffleButton (ev) {
        const divListInPile = examplePile1.querySelectorAll('.example-div')
        examplePile1.shuffle(divListInPile.length)
      }, true)
    }
  })
