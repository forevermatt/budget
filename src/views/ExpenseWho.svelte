<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import DetailHeader from '../components/DetailHeader.svelte'
import WhoSelector from '../components/WhoSelector.svelte'
import { updatePendingTransaction } from '../data/transactions'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

let who = ''

const onWho = () => {
  updatePendingTransaction({ who })
  push(`/expense/account/`)
}
</script>

<DetailHeader title="Paid to" backUrl="#/budget" />

<WhoSelector on:select={onWho} label="Paid to" bind:who={who} />

<ButtonRow>
  <Button icon={faArrowRight} name="next" on:click={onWho} />
</ButtonRow>
