import AccountNew from './AccountNew.svelte'
import Accounts from './Accounts.svelte'
import AccountView from './AccountView.svelte'
import Budget from './Budget.svelte'
import CategoryAmount from './CategoryAmount.svelte'
import CategoryNew from './CategoryNew.svelte'
import CategoryView from './CategoryView.svelte'
import ExpenseAccount from './ExpenseAccount.svelte'
import ExpenseAmount from './ExpenseAmount.svelte'
import ExpenseCategory from './ExpenseCategory.svelte'
import ExpenseNew from './ExpenseNew.svelte'
import ExpenseReview from './ExpenseReview.svelte'
import ExpenseWho from './ExpenseWho.svelte'
import Home from './Home.svelte'
import NotFound from './NotFound.svelte'

// Router docs at https://github.com/ItalyPaleAle/svelte-spa-router
const routes = {
  '/': Home,
  '/account/new': AccountNew,
  '/accounts': Accounts,
  '/account/:uuid': AccountView,
  '/budget': Budget,
  '/category/new': CategoryNew,
  '/category/:uuid': CategoryView,
  '/category/:uuid/amount': CategoryAmount,
  '/expense/account/': ExpenseAccount,
  '/expense/amount/': ExpenseAmount,
  '/expense/category/': ExpenseCategory,
  '/expense/new': ExpenseNew,
  '/expense/review/': ExpenseReview,
  '/expense/who/': ExpenseWho,
  '*': NotFound,
}

export default routes
