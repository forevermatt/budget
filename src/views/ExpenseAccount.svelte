<script>
import AccountSelector from '../components/AccountSelector.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { accounts } from '../data/accounts'
import { getTransactionFrom, transactions, updateTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

export let params // URL parameters provider by router.

$: uuid = params.uuid
$: transaction = getTransactionFrom(uuid, $transactions)

function setAccount(event) {
  let accountUuid = event.detail
  updateTransaction(uuid, { accountUuid })
  push(`/expense/amount/${transaction.uuid}`)
}
</script>

<h2>Paid using</h2>

<AccountSelector accounts={$accounts} on:select={setAccount} />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
