/* globals Redux */

import reducers from '../modules/reducers.js'

export default function configureStore () {
  return Redux.createStore(reducers)
}
