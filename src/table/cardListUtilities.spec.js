var tap = require('tap')
var cardListUtilities = require('./cardListUtilities.tmp.js')

tap.test('setTopZIndexForPile', (t) => {
  const cardList = {
    a: {pile: 'pile1', z: 1},
    b: {pile: 'pile1', z: 2},
    c: {pile: 'pile1', z: 4},
    d: {pile: 'pile1', z: 3},
    o: {z: 1},
    p: {z: 2},
    q: {z: 3}
  }

  // Bumps to the next highest if not already
  const bTop = cardListUtilities.setTopZIndexForPile(cardList, 'b')
  const pTop = cardListUtilities.setTopZIndexForPile(cardList, 'p')
  t.equal(bTop, 5)
  t.equal(pTop, 4)

  // Stays the same if already highest
  const cTop = cardListUtilities.setTopZIndexForPile(cardList, 'c')
  const qTop = cardListUtilities.setTopZIndexForPile(cardList, 'q')
  t.equal(cTop, 4, 'Stays the same if already highest')
  t.equal(qTop, 3, 'Stays the same if already highest')
  t.end()
})
