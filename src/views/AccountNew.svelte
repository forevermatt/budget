<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import DetailHeader from '../components/DetailHeader.svelte'
import TextField from '../components/TextField.svelte'
import { addAccount } from '../data/accounts'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

let name = ''

const onSubmit = async () => {
  await addAccount(name)
  push(`/accounts`)
}
</script>

<DetailHeader title="New account" backUrl="#/accounts" />

<TextField id="new-account-name" label="Account name" bind:value={name} on:submit={onSubmit} />

<ButtonRow>
  <Button icon={faCheck} name="done" on:click={onSubmit} />
</ButtonRow>
