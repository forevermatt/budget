<script>
import { formatDate } from '../helpers/dates'
import { formatAmount } from '../helpers/numbers'

export let transactions = []
</script>

<table class="table table-borderless table-sm">
{#each transactions as { amountTotal, timestamp, who }}
  <tr>
    <td class="text-center">{ formatDate(timestamp) }</td>
    <td>{ who }</td>
    <td class="text-right">
      <sup>$</sup>{ formatAmount(amountTotal) }
    </td>
  </tr>
{:else}
  <tr>
    <td><i>No matching transactions found.</i></td>
  </tr>
{/each}
</table>
