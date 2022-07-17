<script lang="ts">
  import Header from './containers/header.svelte'
  import Overview from './containers/overview.svelte'
  import Transactions from './containers/transactions.svelte'
</script>

<svelte:head>
  <title>peppermint green</title>
</svelte:head>

<Header />

<main class="w-full flex flex-col flex-auto snap-y snap-mandatory overflow-y-auto">
  <Overview />
  <Transactions />
</main>
