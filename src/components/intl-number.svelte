<script lang="ts">
  import { normalizeValue } from '../services/normalize-value.js'
  import { observeUserPreferences } from '../services/user-preferences.js'

  export let value: number = 0
  export let scale: number = 0

  const userPreferences = observeUserPreferences()

  $: number = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: $userPreferences.userCurrency,
    currencyDisplay: 'narrowSymbol',
  }).format(
    normalizeValue(
      { value, scale },
      {
        valueProperty: 'value',
        scaleProperty: 'scale',
        scale: 0,
        precision: $userPreferences.userPrecision,
      }
    ).value
  )
</script>

{number}
