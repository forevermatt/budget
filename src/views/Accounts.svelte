<script>
import { accounts } from '../data/accounts'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { faHome } from '@fortawesome/free-solid-svg-icons'
</script>

<h2>Accounts</h2>

<ul>
  {#each $accounts as account}
    <li>{account.name}</li>
  {/each}
</ul>

<p><a href="#/account/new">Add new account</a></p>

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
