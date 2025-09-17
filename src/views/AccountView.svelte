<script>
import { getAccount, updateAccount } from '../data/accounts'
import { getTransactionsForAccount } from '../data/transactions'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import TransactionList from '../components/TransactionList.svelte'
import Icon from 'fa-svelte'
import { faEdit, faListUl } from '@fortawesome/free-solid-svg-icons'

export let params = {} // URL parameters provided by router

let account = {}
let transactions = []

$: id = params.id || ''
$: loadAccount(id)
$: loadTransactions(id)

const loadAccount = async (accountId) => {
  if (accountId) {
    account = await getAccount(accountId) || {}
  }
}

const loadTransactions = async (accountId) => {
  if (accountId) {
    transactions = await getTransactionsForAccount(accountId)
  }
}

const renameAccount = async () => {
  let name = prompt('Edit account name:', account.name)
  if (name != null) {
    await updateAccount(id, {name})
    await loadAccount(id)
  }
}
</script>

<style>
button {
  color: #337ab7;
  font-weight: bold;
}

button:focus,
button:hover {
  color: #111;
}
</style>

<h2>
  <span>{ account.name }</span>
  <button class="btn btn-link btn-lg float-right" tabindex="0" on:click={renameAccount}>
    <Icon icon={faEdit} />
  </button>
</h2>
<hr class="small" />
<TransactionList {transactions} />

<ButtonRow>
  <Button icon={faListUl} name="accounts" url="#/accounts" left />
</ButtonRow>
