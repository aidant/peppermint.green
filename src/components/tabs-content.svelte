<script lang="ts">
  export let id: string
</script>

<div
  {id}
  class="rounded-t-3xl peppermint-green-bg-dark snap-start overflow-y-auto overscroll-y-contain"
>
  <slot />
</div>
