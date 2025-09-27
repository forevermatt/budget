<script>
import ErrorMessage from './components/ErrorMessage.svelte'
import { refillBudgetCategories } from './data/budget'
import { checkLocalStorageForData } from './data/migration'
import { onMount } from 'svelte'
import Router from 'svelte-spa-router'
import routes from './views/routes'
import database from './data/database'

onMount(async () => {
  await refillBudgetCategories()
  await checkLocalStorageForData()

  // // Attempt to start sync from saved settings (if present)
  // const server = localStorage.getItem('sync.server')
  // const username = localStorage.getItem('sync.username')
  // const password = localStorage.getItem('sync.password')
  // if (server && username && password) {
  //   await database.configureSync(server, username, password)
  // }
})
</script>

<div class="container-xl my-3">
  <ErrorMessage />
  <Router {routes}/>
</div>
