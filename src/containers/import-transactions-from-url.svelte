<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'

  export let transactionsURL = ''

  const dispatch = createEventDispatcher<{ csv: ReadableStream<Uint8Array> }>()

  onMount(async () => {
    try {
      const text = await navigator.clipboard.readText()
      transactionsURL = new URL(text).href
    } catch {}
  })

  const handlePaste = (event: ClipboardEvent) => {
    if (event.target instanceof HTMLInputElement) {
      return
    }

    const text = event.clipboardData?.getData('text/plain')!
    try {
      transactionsURL = new URL(text).href
    } catch {}
  }

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault()

    if (transactionsURL) {
      fetch(transactionsURL).then((response) => {
        if (response.ok && response.body) {
          dispatch('csv', response.body)
        }
      })
    }
  }
</script>

<svelte:window on:paste={handlePaste} />

<div class="my-4 inline-block">
  <form on:submit={handleSubmit}>
    <label for="transactions-url">Enter a url to a transactions CSV file:</label>
    <div class="flex flex-row gap-2 py-1">
      <input
        id="transactions-url"
        type="url"
        name="transactionsURL"
        class="inline-block w-full rounded border-2 px-2 py-1 invalid:border-rose-500"
        on:submit={handleSubmit}
        bind:value={transactionsURL}
      />
      <button
        type="submit"
        class="rounded bg-rose-500 px-4 py-1 text-white"
        aria-label="Add Transactions"
      >
        Add
      </button>
    </div>
  </form>
</div>
