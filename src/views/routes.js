import AccountNew from './AccountNew.svelte'
import Accounts from './Accounts.svelte'
import Budget from './Budget.svelte'
import CategoryAmount from './CategoryAmount.svelte'
import CategoryNew from './CategoryNew.svelte'
import CategoryView from './CategoryView.svelte'
import Home from './Home.svelte'

// Router docs at https://github.com/ItalyPaleAle/svelte-spa-router
const routes = {
  '/': Home,
  '/account/new': AccountNew,
  '/accounts': Accounts,
  '/budget': Budget,
  '/category/new': CategoryNew,
  '/category/:uuid': CategoryView,
  '/category/:uuid/amount': CategoryAmount,
}

export default routes
