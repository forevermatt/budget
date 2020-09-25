<script>
import AccountSelector from '../components/AccountSelector.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { accounts } from '../data/accounts'
import { updatePendingTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

function setAccount(event) {
  let accountUuid = event.detail
  updatePendingTransaction({ accountUuid })
  push(`/expense/amount/`)
}
</script>

<h2>Paid using</h2>

<AccountSelector accounts={$accounts} on:select={setAccount} />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
