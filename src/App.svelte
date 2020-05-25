<script>
import ErrorMessage from './components/ErrorMessage.svelte'
import { loadAccounts } from './data/accounts'
import { loadBudgets } from './data/budgets'
import { loadCategories } from './data/categories'
import { onMount } from 'svelte'
import Router from 'svelte-spa-router'
import routes from './views/routes'

onMount(async () => {
  loadAccounts()
  loadCategories()
  loadBudgets()
})
</script>

<div class="container my-3">
  <ErrorMessage />
  <Router {routes}/>
</div>
