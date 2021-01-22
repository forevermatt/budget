<script>
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import Form from '../components/Form.svelte'
import { createAccount } from '../data/accounts'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { push } from 'svelte-spa-router'

let name = ''
let inputElement = {}

function onSubmit() {
  createAccount(name)
  push(`/accounts`)
}
</script>

<h2>New Account</h2>

<Form on:submit={onSubmit} autofocusElement={inputElement}>
  <input class="form-control" bind:value={name} placeholder="New account name"
         bind:this={inputElement} />
</Form>

<ButtonRow>
  <Button icon={faCheck} name="done" on:click={onSubmit} />
  <Button icon={faTimes} name="cancel" url="#/accounts" left />
</ButtonRow>
