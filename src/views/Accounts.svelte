<script>
import { listAccounts } from '../data/accounts'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { onMount } from 'svelte'

let accounts = []

onMount(async () => {
  accounts = await listAccounts()
})
</script>

<h2>Accounts</h2>

{#each accounts as { name, _id }}
  <p>
    <a href="#/account/{ _id }" class="btn btn-outline-secondary">{ name }</a>
  </p>
{/each}

<p><a href="#/account/new">Add new account</a></p>

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
