<script>
import { getAccount, updateAccount } from '../data/accounts'
import { getTransactionsForAccount } from '../data/transactions'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import DetailHeader from '../components/DetailHeader.svelte'
import MenuItem from '../components/MenuItem.svelte'
import TransactionList from '../components/TransactionList.svelte'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'

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

<DetailHeader title={account.name || ''} backUrl="#/accounts" menuLabel="Account actions">
  <svelte:fragment slot="menu">
    <MenuItem on:click={renameAccount}>Rename account</MenuItem>
  </svelte:fragment>
</DetailHeader>

<TransactionList {transactions} />

<ButtonRow>
  <Button icon={faDollarSign} name="expense" url="#/expense/new" />
</ButtonRow>
