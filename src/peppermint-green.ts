import PeppermintGreen from './peppermint-green.svelte'
import './peppermint-green.css'

addEventListener('load', () => {
  navigator.serviceWorker.register(new URL('./service-worker.ts', import.meta.url).href)

  new PeppermintGreen({
    target: document.body,
  })
})

// const root = document.querySelector<HTMLElement>(':root')
// let hue = +root.style.getPropertyValue('--peppermint-green-hue')

// setInterval(() => {
//   root.style.setProperty('--peppermint-green-hue', `${hue++}`)
// }, 10)
