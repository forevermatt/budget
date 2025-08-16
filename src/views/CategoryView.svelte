<script>
import { getBudgetedFor } from '../data/budget'
import { deleteCategory, getCategory, updateCategory } from '../data/categories'
import { getTransactionsForCategory } from '../data/transactions'
import { formatAmount } from '../helpers/numbers'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import TransactionList from '../components/TransactionList.svelte'
import { faEdit, faHome } from '@fortawesome/free-solid-svg-icons'
import Icon from 'fa-svelte'
import { push } from 'svelte-spa-router'

export let params = {} // URL parameters provided by router

$: id = params.id || ''
$: category = getCategory(id)
$: transactions = getTransactionsForCategory(id)

const renameCategory = () => {
  let name = prompt('Edit category name:', category.name)
  if (name != null) {
    updateCategory(id, {name})
    category = getCategory(id)
  }
}

const onDeleteCategory = () => {
  let confirmed = confirm('Are you sure you want to delete ' + category.name + '?')
  if (confirmed) {
    deleteCategory(id, {name})
    push(`/budget/`)
  }
}
</script>

<h2>
  <span> { category.name }</span>
  <button class="btn btn-link btn-lg" tabindex="0" on:click={renameCategory}>
    <Icon icon={faEdit} />
  </button>
  <a class="btn btn-default float-right" href="#/category/{ id }/amount">
    <sup>$</sup> { formatAmount(getBudgetedFor(id)) }
  </a>
</h2>
<hr class="small" />
<TransactionList {transactions} />

<div class="text-center">
  <button class="btn btn-outline-danger" on:click={onDeleteCategory}>Delete category</button>
</div>

<ButtonRow>
  <Button icon={faHome} name="budget" url="#/budget" left />
</ButtonRow>
