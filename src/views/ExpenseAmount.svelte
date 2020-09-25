<script>
import AmountInput from '../components/AmountInput.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { transactionInProgress, updatePendingTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

$: transaction = $transactionInProgress

function onSubmit(event) {
  let amount = event.detail
  updatePendingTransaction({ amountTotal: amount })
  push(`/expense/category/`)
}
</script>

<h2>Amount paid to {transaction.who}</h2>

<AmountInput on:next={onSubmit} />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
