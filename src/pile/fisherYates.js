export default fisherYates

function fisherYates (count) {
  let result = []

  // Scratch array with numbers 0 through count
  let scratch = Array(count)
  for (let i = 0; i < count; i++) {
    scratch[i] = i
  }

  for (let i = count; i > 0; i--) {
    const rnd = Math.round(Math.random() * (i - 1))
    result.unshift(scratch.splice(rnd, 1)[0])
  }

  return result
}
