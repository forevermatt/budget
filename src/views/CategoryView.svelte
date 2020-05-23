<script>
import { categories, updateCategory } from '../data/categories'
import { formatAmount } from '../helpers/number-formats'

export let params = {} // URL parameters provided by router

$: uuid = params.uuid || ''
$: category = $categories.find(category => category.uuid === uuid) || {}

const renameCategory = () => {
  var name = prompt('Edit category name:', category.name)
  if (name != null) {
    updateCategory(uuid, {name})
  }
}
</script>

<style>
.editable {
  cursor: pointer;
}
</style>

<h2>
  <b class="editable" on:click={renameCategory}
     title="(Click to rename)">{ category.name }:</b>
  <a class="btn btn-default" href="#/category/{ uuid }/amount">
    <sup>$</sup> { formatAmount(category.amount) }
  </a>
</h2>
<hr class="small" />
