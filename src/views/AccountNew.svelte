<script>
import { createAccount } from '../data/accounts'
import Form from '../components/Form.svelte'
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
