<script lang="ts">
  import Header from './components/header.svelte'
  import Overview from './components/overview.svelte'
  import Transactions from './components/transactions.svelte'
</script>

<svelte:head>
  <title>peppermint green</title>
</svelte:head>

<Header />

<main class="w-full flex flex-col flex-auto snap-y snap-mandatory overflow-y-auto">
  <Overview />
  <Transactions />
</main>
