<script>
import { deleteCategory, getCategory, updateCategory } from '../data/categories'
import { getTransactionsForCategory } from '../data/transactions'
import { formatAmount } from '../helpers/numbers'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import TransactionList from '../components/TransactionList.svelte'
import { faDollarSign, faEdit } from '@fortawesome/free-solid-svg-icons'
import Icon from '../components/Icon.svelte'
import { push } from 'svelte-spa-router'

export let params = {} // URL parameters provided by router

let category = {}
let transactions = []

$: id = params.id || ''
$: loadCategory(id)
$: loadTransactions(id)

const loadCategory = async (categoryId) => {
  if (categoryId) {
    category = await getCategory(categoryId) || {}
  }
}

const loadTransactions = async (categoryId) => {
  if (categoryId) {
    transactions = await getTransactionsForCategory(categoryId)
  }
}

const renameCategory = async () => {
  let name = prompt('Edit category name:', category.name)
  if (name != null) {
    await updateCategory(id, {name})
    await loadCategory(id)
  }
}

const onDeleteCategory = async () => {
  let confirmed = confirm('Are you sure you want to delete ' + category.name + '?')
  if (confirmed) {
    await deleteCategory(id)
    push(`/budget/`)
  }
}
</script>

<h2>
  <span> { category.name }</span>
  <button class="btn btn-link btn-lg" tabindex="0" on:click={renameCategory}>
    <Icon icon={faEdit} />
  </button>
  <a class="btn float-end" href="#/category/{ id }/amount">
    <sup>$</sup> { formatAmount(category.budgeted) }
  </a>
</h2>
<hr class="small" />
<TransactionList {transactions} />

<div class="text-center">
  <button class="btn btn-outline-danger" on:click={onDeleteCategory}>Delete category</button>
</div>

<ButtonRow>
  <Button icon={faDollarSign} name="expense" url="#/expense/new" />
</ButtonRow>
