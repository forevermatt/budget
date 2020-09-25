<script>
import WhoSelector from '../components/WhoSelector.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { updatePendingTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

const onSelect = event => {
  const who = event.detail
  updatePendingTransaction({ who })
  push(`/expense/account/`)
}
</script>

<WhoSelector on:select={onSelect} title="Paid to:" />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
