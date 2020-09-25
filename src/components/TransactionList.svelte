<script>
import { formatDate } from '../helpers/dates'
import { formatAmount } from '../helpers/numbers'

export let transactions = []
</script>

{#each transactions as { amountTotal, timestamp, who }}
  <div class="row">
    <div class="col-2 text-center">{ formatDate(timestamp) }</div>
    <div class="col-7">{ who }</div>
    <div class="col-3 text-right">
      <sup>$</sup>{ formatAmount(amountTotal) }
    </div>
  </div>
{:else}
  <i>No matching transactions found.</i>
{/each}
