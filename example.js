const crdtrxCard = 'crdtrx-card'
const crdtrxPile = 'crdtrx-pile'
const tableElement = document.getElementById('example-card-tricks-table')
const examplePile1 = document.getElementById('example-pile-1')
const cardNames = ['01c', '01d', '01h', '01s', '02c', '02d', '02h', '02s', '03c', '03d', '03h', '03s', '04c', '04d', '04h', '04s', '05c', '05d', '05h', '05s', '06c', '06d', '06h', '06s', '07c', '07d', '07h', '07s', '08c', '08d', '08h', '08s', '09c', '09d', '09h', '09s', '10c', '10d', '10h', '10s', '11c', '11d', '11h', '11s', '12c', '12d', '12h', '12s', '13c', '13d', '13h', '13s']

// Not using any fancy state management for this example.  The topZ will just
// increment every time a user clicks on a card and that card will have the top
// most z-index.
let topZ = cardNames.length

Promise.all([
  window.customElements.whenDefined(crdtrxCard).then(() => window.customElements.get(crdtrxCard)),
  window.customElements.whenDefined(crdtrxPile).then(() => window.customElements.get(crdtrxPile))
]).then(values => {
  const Card = values.shift()
  const Pile = values.shift()
  init(Card, Pile)
})

function init (Card, Pile) {
  // Create all the cards
  const cardListFragment = document.createDocumentFragment()
  Pile.randomListOfNumbers(cardNames.length).reduce((fragment, value, index) => {
    const name = cardNames[value]
    const card = new Card()
    const pos = examplePile1.position(index)
    card.setAttribute('id', `example-card-${value}`)
    card.setAttribute('name', name)
    card.setAttribute('back', 'back101')
    card.setAttribute('side', 'back')
    card.setAttribute('x', pos.x)
    card.setAttribute('y', pos.y)
    card.setAttribute('z', index)
    card.setAttribute('r', pos.r)
    card.setAttribute('container', tableElement.id)
    // card.setAttribute('friction', true)

    card.addEventListener('transitionend', finished, true)
    function finished (ev) {
      card.setAttribute('friction', true)
      card.removeEventListener('transitionend', finished)
    }

    // Set flip card action
    card.addEventListener('dblclick', function handleDoubleClick () {
      flipCard(card)
    }, true)

    // Set z-index to top most z-index when mousedown
    card.addEventListener('mousedown', function handleMousedown () {
      topZ = Number(card.z) !== topZ ? topZ + 1 : topZ
      card.z = String(topZ)
    }, true)

    fragment.appendChild(card)
    return fragment
  }, cardListFragment)

  // Add them to the table
  examplePile1.querySelector('[slot=area]').appendChild(cardListFragment)

  // Set friction to allow moving cards after they have been added
  const cardsInPile = examplePile1.querySelectorAll(crdtrxCard)
  cardsInPile.forEach((card) => {
    card.setAttribute('friction', true)
  })
}

function flipCard (card) {
  card.setAttribute('side', card.getAttribute('side') === 'front' ? 'back' : 'front')
}
function flipCardUp (card) {
  card.setAttribute('side', 'front')
}
function flipCardDown (card) {
  card.setAttribute('side', 'back')
}

// Listen for the shuffle event on a pile
examplePile1.addEventListener('crdtrx-pile-shuffle', shuffle, true)
function shuffle (ev) {
  // list contains the list of random integers
  const list = ev.detail.list
  const cardsInPile = ev.target.querySelectorAll(crdtrxCard)

  // Reset the topZ
  topZ = cardsInPile.length

  cardsInPile.forEach((card) => {
    const z = list.shift()
    const prevZ = Math.min(card.z, topZ)

    // Shift all to the right
    // Remove the friction attribute to allow for transition
    card.removeAttribute('friction')
    card.x = 200 + (prevZ * 15)
    card.y = prevZ * 15

    // One by one move a random one back
    window.setTimeout(() => {
      card.removeAttribute('friction')
      card.addEventListener('transitionend', finished, true)
      card.z = z
      card.x = z * 15
      card.y = z * 15

      const timeoutId = window.setTimeout(finished, 400)
      function finished (ev) {
        window.clearTimeout(timeoutId)
        // Add impetus back in
        card.removeEventListener('transitionend', finished)
        card.setAttribute('friction', true)
      }
      // card.setAttribute('friction', true)
    }, (prevZ * 50) + 1000)
  })
}

// Set shuffle button action
const shuffleButton = document.getElementById('shuffle')
if (shuffleButton) {
  shuffleButton.addEventListener('click', function handleClickShuffleButton (ev) {
    const cardsInPile = examplePile1.querySelectorAll(crdtrxCard)

    // Call the shuffle method with the count of random integers that will be added to the event.detail.
    examplePile1.shuffle(cardsInPile.length)
  }, true)
}

// Stack all button example
document.getElementById('stack-all').addEventListener('click', function (ev) {
  // Call the stack method with the count of items that will be added to the event.detail.
  const cardsInPile = examplePile1.querySelectorAll(crdtrxCard)
  examplePile1.stack(cardsInPile.length)
})

// Listen for the stack event on a pile
examplePile1.addEventListener('crdtrx-pile-stack', stack, true)
function stack (ev) {
  // list contains the list of positions
  const list = ev.detail.list
  const cardsInPile = examplePile1.querySelectorAll(crdtrxCard)
  cardsInPile.forEach((card, index) => {
    const z = Math.min(Number(card.z) || 0, list.length - 1)
    const pos = list[z]

    // disable impetus
    card.removeAttribute('friction')

    // One by one shift to new stack position
    window.setTimeout(() => {
      card.addEventListener('transitionend', finished, true)
      const timeoutId = window.setTimeout(finished, 400)
      card.x = pos.x
      card.y = pos.y
      card.r = pos.r

      function finished (ev) {
        window.clearTimeout(timeoutId)
        // Add impetus back in
        card.setAttribute('friction', true)
        card.removeEventListener('transitionend', finished)
      }
    }, (z * 50) + 100)
  })
}

// flip button example
document.getElementById('flip-up').addEventListener('click', function (ev) {
  const cardsInPile = examplePile1.querySelectorAll(crdtrxCard)
  cardsInPile.forEach(flipCardUp)
})
document.getElementById('flip-down').addEventListener('click', function (ev) {
  const cardsInPile = examplePile1.querySelectorAll(crdtrxCard)
  cardsInPile.forEach(flipCardDown)
})
