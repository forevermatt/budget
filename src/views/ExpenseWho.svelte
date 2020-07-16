<script>
import WhoSelector from '../components/WhoSelector.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { createTransaction } from '../data/transactions'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

let who = ''

const onSelect = event => {
  const name = event.detail
  const transaction = createTransaction({
    timestamp: Date.now(),
    who: name,
  })
  push(`/expense/amount/${transaction.uuid}`)
}
</script>

<WhoSelector on:select={onSelect} title="Paid to:" />

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
