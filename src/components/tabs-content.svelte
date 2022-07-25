<script lang="ts">
  export let id: string
</script>

<div
  {id}
  class="peppermint-green-layer-1 snap-start overflow-y-auto overscroll-y-contain rounded-t-3xl"
>
  <slot />
</div>
