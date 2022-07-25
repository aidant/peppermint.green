<script lang="ts">
  export let href: string
</script>

<li class="inline-flex snap-start items-center whitespace-nowrap">
  <a {href}>
    <slot />
  </a>
</li>
