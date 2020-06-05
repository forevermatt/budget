<script>
import ErrorMessage from './components/ErrorMessage.svelte'
import { loadAccounts } from './data/accounts'
import { loadBudget } from './data/budget'
import { loadCategories } from './data/categories'
import { onMount } from 'svelte'
import Router from 'svelte-spa-router'
import routes from './views/routes'

onMount(async () => {
  loadAccounts()
  loadCategories()
  loadBudget()
})
</script>

<div class="container my-3">
  <ErrorMessage />
  <Router {routes}/>
</div>
