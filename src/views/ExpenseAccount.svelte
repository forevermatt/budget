<script>
import ButtonRow from '../components/ButtonRow.svelte'
import DetailHeader from '../components/DetailHeader.svelte'
import PickerList from '../components/PickerList.svelte'
import { listAccounts } from '../data/accounts'
import { updatePendingTransaction } from '../data/transactions'
import { onMount } from 'svelte'
import { push } from 'svelte-spa-router'

let accounts = []

const setAccount = (event) => {
  updatePendingTransaction({ accountId: event.detail })
  push(`/expense/amount/`)
}

onMount(async () => {
  accounts = await listAccounts()
})
</script>

<DetailHeader title="Paid using" backUrl="#/expense/who/" />

<PickerList items={accounts} on:select={setAccount} />

<ButtonRow />
