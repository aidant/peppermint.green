<script lang="ts">
  import { observeUserPreferences } from '../services/user-preferences'

  const userPreferences = observeUserPreferences()

  const ammount = Math.random() * (69420 - 9001) + 9001
  const ammountDisplay = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: $userPreferences.userCurrency,
    currencyDisplay: 'narrowSymbol',
  }).format(ammount)
</script>

<div class="w-full text-center text-6xl font-display lining-nums p-6 snap-start snap-always">
  <span>{ammountDisplay}</span>
  <div style="min-height: 128px" />
</div>
