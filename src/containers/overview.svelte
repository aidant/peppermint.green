<script lang="ts">
  import IntlNumber from '../components/intl-number.svelte'
  import { observeTransactionsAmount } from '../services/transactions'

  const overview = observeTransactionsAmount()
</script>

<div
  class="w-full snap-start snap-always p-6 text-center font-display text-6xl lining-nums tabular-nums"
>
  <span
    ><IntlNumber value={$overview?.transactionAmount} scale={$overview?.transactionScale} /></span
  >
  <div style="min-height: 128px" />
</div>
