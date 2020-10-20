<script>
import AmountInput from '../components/AmountInput.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { transactionInProgress, updatePendingTransaction } from '../data/transactions'
import { faArrowRight, faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

$: transaction = $transactionInProgress

let amountTotal = 0

const onAmount = () => {
  updatePendingTransaction({ amountTotal })
  push(`/expense/category/`)
}
</script>

<h2>Amount paid to {transaction.who}</h2>

<AmountInput on:next={onAmount} bind:resultingAmount={amountTotal} />

<ButtonRow>
  <Button icon={faArrowRight} name="next" on:click={onAmount} />
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
