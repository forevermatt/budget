<script>
import WhoSelector from '../components/WhoSelector.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { updatePendingTransaction } from '../data/transactions'
import { faArrowRight, faHome } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

let who = ''

const onWho = () => {
  updatePendingTransaction({ who })
  push(`/expense/account/`)
}
</script>

<WhoSelector on:select={onWho} title="Paid to:" bind:who={who} />

<ButtonRow>
  <Button icon={faArrowRight} name="next" on:click={onWho} />
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
