<script>
import { getAccount, updateAccount } from '../data/accounts'
import { getTransactionsForAccount } from '../data/transactions'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import TransactionList from '../components/TransactionList.svelte'
import Icon from 'fa-svelte'
import { faEdit, faListUl } from '@fortawesome/free-solid-svg-icons'

export let params = {} // URL parameters provided by router

$: uuid = params.uuid || ''
$: account = getAccount(uuid)
$: transactions = getTransactionsForAccount(uuid)

const renameAccount = () => {
  let name = prompt('Edit account name:', account.name)
  if (name != null) {
    updateAccount(uuid, {name})
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
