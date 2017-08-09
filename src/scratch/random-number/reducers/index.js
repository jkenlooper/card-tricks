import randomNumbers from './randomNumbers.js'

export default function number (state = {}, action) {
  return {
    randomNumbers: randomNumbers(state.randomNumbers, action)
  }
}
