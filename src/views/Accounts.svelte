<script>
import { accounts } from '../data/accounts'
</script>

<h2>Accounts</h2>

<ul>
  {#each $accounts as account}
    <li>{account.name}</li>
  {/each}
</ul>

<p><a href="#/account/new">Add new account</a></p>

<p><a href="#/budget">Budget</a></p>
