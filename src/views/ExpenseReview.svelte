<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import CategoryTags from '../components/CategoryTags.svelte'
import { accounts, getAccountFrom } from '../data/accounts'
import { categories, getCategoryFrom } from '../data/categories'
import { applyTransaction, getTransactionFrom, transactions, updateTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { formatDateISO8601 } from "../helpers/dates";
import { formatAmount } from "../helpers/numbers";
import { push } from 'svelte-spa-router'

export let params // URL parameters provider by router.

$: uuid = params.uuid
$: transaction = getTransactionFrom(uuid, $transactions)
$: account = getAccountFrom(transaction.accountUuid, $accounts)
$: accountName = account.name || ''
$: amountTotal = transaction.amountTotal || 0

function onDone() {
  applyTransaction(uuid)
  push(`/budget`)
}

function setComment(event) {
  let comment = event.detail
  updateTransaction(uuid, { comment })
  push(`/budget`)
}

const setTimestamp = event => {
  let dateString = event.target.value
  let when = new Date(`${dateString} 12:00:00`)
  updateTransaction(uuid, { timestamp: when.getTime() })
}
</script>

<div class="row">
  <div class="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3">
    <h2>Review Expense</h2>
    <p>
      <a class="btn btn-outline-secondary" href="#/expense/who/{uuid}">{transaction.who}</a>
      <a class="btn btn-outline-secondary float-right" href="#/expense/amount/{uuid}">
        ${formatAmount(amountTotal)}
      </a>
    </p>
    <p>
      <CategoryTags {transaction} />
    </p>
    <p>
      <b>Account:</b>
      <a class="btn btn-outline-secondary float-right" href="#/expense/account/{uuid}">
        {accountName}
      </a>
    </p>
    <p>
      <b>Date:</b>
      <input type="date" class="float-right" on:change={setTimestamp} value={formatDateISO8601(transaction.timestamp)} />
    </p>
    <!-- TODO: Add "Comment" field. -->
  </div>
</div>

<ButtonRow>
  <Button icon={faHome} name="done" on:click={onDone} />
</ButtonRow>
