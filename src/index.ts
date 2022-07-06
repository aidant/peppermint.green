import Application from './index.svelte'
import './style.css'

addEventListener('load', () => {
  new Application({
    target: document.querySelector('#application'),
  })
})
