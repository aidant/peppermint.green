<script lang="ts">
  import IntlNumber from '../components/intl-number.svelte'
  import { observeTransactionsSummary } from '../services/transactions.js'

  const transactions$ = observeTransactionsSummary()

  $: transactions = Object.values($transactions$?.transactions || {})
</script>

{#each transactions as transaction (transaction.transactionId)}
  <div class="flex flex-row items-center justify-between gap-4 p-4">
    <div>
      <div class="text-lg">{transaction.transactionTitle}</div>
      <div>{transaction.transactionDescription}</div>
    </div>
    <div class="font-display text-xl lining-nums tabular-nums">
      <IntlNumber
        value={transaction.transactionDirection === 'out'
          ? -transaction.transactionAmount
          : transaction.transactionAmount}
        scale={transaction.transactionScale}
      />
    </div>
  </div>
{/each}
