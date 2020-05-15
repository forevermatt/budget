<script>
import { createAccount } from '../data/accounts'
import { push } from 'svelte-spa-router'

let name = ''

function onSubmit() {
  createAccount(name)
  push(`/accounts`)
}
</script>

<h2>New Account</h2>

<form on:submit|preventDefault={onSubmit}>
  <input class="form-control" bind:value={name} placeholder="New account name" />
</form>
