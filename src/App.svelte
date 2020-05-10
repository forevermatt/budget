<script>
import ErrorMessage from './components/ErrorMessage.svelte'
import { loadCategories } from './data/categories'
import { onMount } from 'svelte'
import Router from 'svelte-spa-router'
import routes from './views/routes'

onMount(async () => {
  loadCategories()
})

</script>

<div class="container my-3">
  <ErrorMessage />
  <Router {routes}/>
</div>
