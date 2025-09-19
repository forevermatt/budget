<script>
import ErrorMessage from './components/ErrorMessage.svelte'
import { refillBudgetCategories } from './data/budget'
import { checkLocalStorageForData } from './data/migration'
import { onMount } from 'svelte'
import Router from 'svelte-spa-router'
import routes from './views/routes'

onMount(async () => {
  await refillBudgetCategories()
  await checkLocalStorageForData()
})
</script>

<div class="container-xl my-3">
  <ErrorMessage />
  <Router {routes}/>
</div>
