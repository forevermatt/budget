<script>
import WhoSelector from '../components/WhoSelector.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { getTransactionFrom, transactions, updateTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

export let params // URL parameters provider by router.

$: uuid = params.uuid
$: transaction = getTransactionFrom(uuid, $transactions)

const onSelect = event => {
  const who = event.detail
  updateTransaction(uuid, { who })
  push(`/expense/account/${transaction.uuid}`)
}
</script>

<WhoSelector on:select={onSelect} title="Paid to:" autofocus />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
