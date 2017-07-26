import {version} from '../package.json'
import foo from './foo.js'
import './app.css'

export default function () {
  console.log(foo)
  console.log(`version ${version}`)
}
