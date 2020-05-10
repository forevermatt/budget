import Budget from './Budget.svelte'
import CategoryAmount from './CategoryAmount.svelte'
import CategoryNew from './CategoryNew.svelte'
import Home from './Home.svelte'

// Router docs at https://github.com/ItalyPaleAle/svelte-spa-router
const routes = {
  '/': Home,
  '/budget': Budget,
  '/category/new': CategoryNew,
  '/category/:uuid/amount': CategoryAmount,
}

export default routes
