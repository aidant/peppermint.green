<script lang="ts">
  export let href: string
</script>

<li class="snap-start inline-flex items-center whitespace-nowrap">
  <a {href}>
    <slot />
  </a>
</li>
