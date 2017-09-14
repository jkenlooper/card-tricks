export {setTopZIndexForPile}
// TODO: no longer needed, but is an example of tested code.

function setTopZIndexForPile (cardList, targetCardId) {
  // Get the max zIndex for the card within its pile
  const pile = cardList[targetCardId].pile
  const maxZIndex = Object.keys(cardList).filter((cardId) => {
    // pile can be undefined
    return cardList[cardId].pile === pile
  }).reduce((z, cardId) => {
    return Math.max(z, cardList[cardId].z)
  }, 1)

  // Return the next highest z-index if not already the max
  if (cardList[targetCardId].z < maxZIndex) {
    return maxZIndex + 1
  }
  return maxZIndex
}
