<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{ csv: ReadableStream<Uint8Array> }>()

  const handleChange = (event: Event) => {
    const redableStream = (event.target as HTMLInputElement).files?.[0]?.stream()

    if (redableStream) {
      dispatch('csv', redableStream)
    }
  }
</script>

<label>
  Upload a CSV file to import transactions from
  <input
    class="hidden"
    type="file"
    name="transactions"
    accept="text/csv"
    required
    on:change={handleChange}
  />
</label>
