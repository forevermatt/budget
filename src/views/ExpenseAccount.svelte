<script>
import AccountSelector from '../components/AccountSelector.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { listAccounts } from '../data/accounts'
import { updatePendingTransaction } from '../data/transactions'
import { onMount } from 'svelte'
import { push } from 'svelte-spa-router'

let accounts = []

function setAccount(event) {
  let accountId = event.detail
  updatePendingTransaction({ accountId })
  push(`/expense/amount/`)
}

onMount(async () => {
  accounts = await listAccounts()
})
</script>

<h2>Paid using</h2>

<AccountSelector accounts={accounts} on:select={setAccount} />

<ButtonRow />
