<script>
import { accounts, updateAccount } from '../data/accounts'
import { getTransactionsForAccount } from '../data/transactions'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import TransactionList from '../components/TransactionList.svelte'
import Icon from 'fa-svelte'
import { faEdit, faListUl } from '@fortawesome/free-solid-svg-icons'

export let params = {} // URL parameters provided by router

$: uuid = params.uuid || ''
$: account = $accounts.find(account => account.uuid === uuid) || {}
$: transactions = getTransactionsForAccount(uuid)

const renameAccount = () => {
  let name = prompt('Edit account name:', account.name)
  if (name != null) {
    updateAccount(uuid, {name})
  }
}
</script>

<style>
a {
  color: #337ab7;
  font-weight: bold;
}

a:focus,
a:hover {
  color: #111;
}

.editable {
  cursor: pointer;
}
</style>

<h2>
  <span class="editable">{ account.name }</span>
  <a class="float-right" tabindex="0"
     href="javascript:void(0)" on:click={renameAccount}>
    <Icon icon={faEdit} />
  </a>
</h2>
<hr class="small" />
<TransactionList {transactions} />

<ButtonRow>
  <Button icon={faListUl} name="accounts" url="#/accounts" left />
</ButtonRow>
