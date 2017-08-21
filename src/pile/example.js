const crdtrxPile = 'crdtrx-pile'
const exampleContainerElement = document.getElementById('example-container')
const examplePile1 = document.getElementById('example-pile-1')
const exampleCardCount = 52

window.customElements.whenDefined(crdtrxPile)
  .then(() => {
    return window.customElements.get(crdtrxPile)
  })
  .then((Pile) => {
    // Pile is now defined and could be used to create pile elements.

    // Create 52 example elements that are in a random order
    const exampleList = Pile.randomListOfNumbers(exampleCardCount).map((value, index) => {
      const div = document.createElement('div')
      div.setAttribute('id', `example-div-${index}`)
      div.setAttribute('class', 'example-div')
      div.textContent = index
      div.style.zIndex = value
      return div
    })
    const exampleDivContainer = document.createDocumentFragment()
    exampleList.forEach((div, index) => {
      // Get the initial position for the index
      const pos = examplePile1.position(index)
      div.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.r}deg)`

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

    const multiplierInput = document.getElementById('multiplier')
    if (multiplierInput) {
      multiplierInput.addEventListener('input', function handleChange (ev) {
        examplePile1.setAttribute('multiplier', ev.target.value)
        // Update the position of all example divs
        examplePile1.querySelectorAll('.example-div').forEach((div) => {
          const pos = examplePile1.position(div.style.zIndex)
          div.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.r}deg)`
        })
      }, true)
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

    // Set stack button action
    const stackButtons = document.querySelectorAll('button[stack-button]')
    if (stackButtons) {
      stackButtons.forEach((stackButton) => {
        stackButton.addEventListener('click', function handleClickStackButton (ev) {
          const divListInPile = examplePile1.querySelectorAll('.example-div')
          const type = ev.target.getAttribute('data-type')
          examplePile1.setAttribute('type', type)

          // Call the stack method with the count of items that will be added to the event.detail.
          examplePile1.stack(divListInPile.length)
        }, true)
      })
    }

    // Listen for the stack event on a pile
    exampleContainerElement.addEventListener('crdtrx-pile-stack', stack, true)
    function stack (ev) {
      // list contains the list of positions
      const list = ev.detail.list
      const divListInPile = ev.target.querySelectorAll('.example-div')
      divListInPile.forEach((div, index) => {
        const z = Math.min(Number(div.style.zIndex) || 0, list.length - 1)
        const pos = list[z]

        // Reset
        // div.style.transform = 'translate3d(0px, 0px, 0)'

        // One by one shift to new stack position
        window.setTimeout(() => {
          div.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.r}deg)`
        }, (z * 50) + 100)
      })
    }
  })
