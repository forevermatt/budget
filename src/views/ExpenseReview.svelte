<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import CategoryTags from '../components/CategoryTags.svelte'
import { getAccount } from '../data/accounts'
import { savePendingTransaction, transactionInProgress, updatePendingTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { formatDateISO8601 } from "../helpers/dates";
import { formatAmount } from "../helpers/numbers";
import { push } from 'svelte-spa-router'

$: transaction = $transactionInProgress
$: transactionNote = transaction.note || ''
$: account = getAccount(transaction.accountUuid)
$: accountName = account.name || ''
$: amountTotal = transaction.amountTotal || 0

function onDone() {
  savePendingTransaction()
  push(`/budget`)
}

function setComment(event) {
  let comment = event.detail
  updatePendingTransaction({ comment })
}

const setNote = event => {
  let note = event.target.value
  updatePendingTransaction({ note })
}

const setTimestamp = event => {
  let dateString = event.target.value
  let when = new Date(`${dateString} 12:00:00`)
  updatePendingTransaction({ timestamp: when.getTime() })
}
</script>

<div class="row">
  <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3">
    <h2>Review Expense</h2>
    <p>
      <a class="btn btn-outline-secondary" href="#/expense/who/">{transaction.who}</a>
      <a class="btn btn-outline-secondary float-right" href="#/expense/amount/">
        ${formatAmount(amountTotal)}
      </a>
    </p>
    <p>
      <CategoryTags {transaction} />
    </p>
    <p>
      <b>Account:</b>
      <a class="btn btn-outline-secondary float-right" href="#/expense/account/">
        {accountName}
      </a>
    </p>
    <p>
      <b>Date:</b>
      <input type="date" class="float-right" on:change={setTimestamp} value={formatDateISO8601(transaction.timestamp)} />
    </p>
    <p>
      <b>Note:</b>
      <input class="float-right" on:change={setNote} value={transactionNote} />
    </p>
  </div>
</div>

<ButtonRow>
  <Button icon={faHome} name="done" on:click={onDone} />
</ButtonRow>
