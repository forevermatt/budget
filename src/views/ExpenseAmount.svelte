<script>
import AmountInput from '../components/AmountInput.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import DetailHeader from '../components/DetailHeader.svelte'
import { transactionInProgress, updatePendingTransaction } from '../data/transactions'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

$: transaction = $transactionInProgress

let amountTotal = 0

const onAmount = () => {
  updatePendingTransaction({ amountTotal })
  push(`/expense/category/`)
}
</script>

<style>
.amount-screen {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px 8px 0;
}

/* The header asks only for the amount, so the payee is restated here rather
   than crammed into the title as it used to be. */
.paid-to {
  color: var(--on-surface-variant);
  font-size: 15px;
  font-weight: 500;
  margin: 0;
}

.paid-to strong {
  color: var(--on-surface);
  font-weight: 700;
}
</style>

<DetailHeader title="Amount" backUrl="#/expense/account/" />

<div class="amount-screen">
  <p class="paid-to">Paid to <strong>{ transaction.who }</strong></p>
  <AmountInput on:next={onAmount} bind:resultingAmount={amountTotal} />
</div>

<ButtonRow>
  <Button icon={faArrowRight} name="next" on:click={onAmount} />
</ButtonRow>
