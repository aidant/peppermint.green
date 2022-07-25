<script lang="ts">
  import ImportTransactionsFromCSV from './import-transactions-from-csv.svelte'
</script>

<div class="flex flex-col">
  <!-- <ImportTransactionsFromURL on:csv /> -->
  <!-- <div class="flex flex-row items-center gap-1"> -->
  <!--   <div class="mx-2 mt-1 w-full border-t border-zinc-200" /> -->
  <!--   <span>or</span> -->
  <!--   <div class="mx-2 mt-1 w-full border-t border-zinc-200" /> -->
  <!-- </div> -->
  <ImportTransactionsFromCSV on:csv />
</div>
