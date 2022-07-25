<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import IconClose from './icon-close.svelte'

  const dispatch = createEventDispatcher<{ close: never }>()

  let dialog: HTMLDialogElement
  onMount(() => {
    dialog.showModal()
  })

  const handleClick = (event: MouseEvent) => {
    if (event.target === dialog) {
      dispatch('close')
    }
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return

    event.preventDefault()
    dispatch('close')
  }

  const handleClose = () => {
    dispatch('close')
  }
</script>

<svelte:window on:keydown={handleKeyPress} />

<div on:click={handleClick}>
  <dialog
    bind:this={dialog}
    class="peppermint-green-layer-3 container fixed inset-0 m-auto max-w-3xl overflow-hidden rounded-xl p-2 px-8 py-6 text-current shadow-xl"
  >
    <slot />
    <button
      class="absolute top-4 right-4 rounded"
      title="Close"
      aria-label="Close"
      on:click={handleClose}
    >
      <IconClose />
    </button>
  </dialog>
</div>
