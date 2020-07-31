<script>
import AmountInput from '../components/AmountInput.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { getTransactionFrom, transactions, updateTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

export let params // URL parameters provider by router.

$: uuid = params.uuid
$: transaction = getTransactionFrom(uuid, $transactions)

function onSubmit(event) {
  let amount = event.detail
  updateTransaction(uuid, { amountTotal: amount })
  push(`/expense/category/${transaction.uuid}`)
}
</script>

<h2>Amount paid to {transaction.who}</h2>

<AmountInput on:next={onSubmit} />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
