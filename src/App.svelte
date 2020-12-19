<script>
import ErrorMessage from './components/ErrorMessage.svelte'
import { loadAccounts } from './data/accounts'
import { loadBudget, refillBudgetCategories } from './data/budget'
import { loadCategories } from './data/categories'
import { loadTransactions } from './data/transactions'
import { onMount } from 'svelte'
import Router from 'svelte-spa-router'
import routes from './views/routes'

onMount(async () => {
  loadAccounts()
  loadCategories()
  loadBudget()
  loadTransactions()
  refillBudgetCategories()
})
</script>

<div class="container-xl my-3">
  <ErrorMessage />
  <Router {routes}/>
</div>
