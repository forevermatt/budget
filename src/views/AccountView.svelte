<script>
import { accounts, updateAccount } from '../data/accounts'
import { getTransactionsForAccount } from '../data/transactions'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import TransactionList from '../components/TransactionList.svelte'
import { faListUl } from '@fortawesome/free-solid-svg-icons'

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
.editable {
  cursor: pointer;
}
</style>

<h2>
  <b class="editable" on:click={renameAccount}
     title="(Click to rename)">{ account.name }:</b>
</h2>
<hr class="small" />
<TransactionList {transactions} />

<ButtonRow>
  <Button icon={faListUl} name="accounts" url="#/accounts" left />
</ButtonRow>
