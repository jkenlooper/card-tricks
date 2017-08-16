const crdtrxPile = 'crdtrx-pile'
const exampleContainerElement = document.getElementById('example-container')
const examplePile1 = document.getElementById('example-pile-1')

window.customElements.whenDefined(crdtrxPile)
  .then(() => {
    return window.customElements.get(crdtrxPile)
  })
  .then((Pile) => {
    // Pile is now defined and could be used to create pile elements.

    // Create 52 example elements that are in a random order
    const exampleList = Pile.randomListOfNumbers(52).map((value, index) => {
      const div = document.createElement('div')
      div.setAttribute('id', `example-div-${index}`)
      div.setAttribute('class', 'example-div')
      div.textContent = index
      div.style.zIndex = value
      return div
    })
    const exampleDivContainer = document.createDocumentFragment()
    exampleList.forEach((div) => {
      exampleDivContainer.appendChild(div)
    })
    examplePile1.querySelector('[slot=area]').appendChild(exampleDivContainer)

    // Listen for the shuffle event on a pile
    exampleContainerElement.addEventListener('crdtrx-pile-shuffle', shuffle, true)
    function shuffle (ev) {
      // list contains the list of random integers
      const list = ev.detail.list
      const divListInPile = ev.target.querySelectorAll('.example-div')
      divListInPile.forEach((div) => {
        const z = list.shift()
        const prevZ = div.style.zIndex

        // Shift all to the right
        div.style.transform = `translate3d(${200 + (prevZ * 15)}px, ${prevZ * 15}px, 0)`

        // One by one move a random one back
        window.setTimeout(() => {
          div.style.zIndex = z
          div.style.transform = `translate3d(${z * 15}px, ${z * 15}px, 0)`
        }, (prevZ * 50) + 1000)
      })
    }

    // Set shuffle button action
    const shuffleButton = document.getElementById('shuffle')
    if (shuffleButton) {
      shuffleButton.addEventListener('click', function handleClickShuffleButton (ev) {
        const divListInPile = examplePile1.querySelectorAll('.example-div')

        // Call the shuffle method with the count of random integers that will be added to the event.detail.
        examplePile1.shuffle(divListInPile.length)
      }, true)
    }
  })
