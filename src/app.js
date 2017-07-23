import {version} from '../package.json'
import foo from './foo.js'
import './table'
import './card'

export default function () {
  console.log(foo)
  console.log(`version ${version}`)
}
