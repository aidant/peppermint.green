import PeppermintGreen from './peppermint-green.svelte'
import './peppermint-green.css'

addEventListener('load', () => {
  navigator.serviceWorker.register('./service-worker.ts')

  new PeppermintGreen({
    target: document.body,
  })
})

// const root = document.querySelector<HTMLElement>(':root')
// let hue = +root.style.getPropertyValue('--peppermint-green-hue')

// setInterval(() => {
//   root.style.setProperty('--peppermint-green-hue', `${hue++}`)
// }, 10)
