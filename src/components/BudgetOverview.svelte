<script>
import CategoryGraph from './CategoryGraph.svelte'
import { categories } from '../data/categories'
import { dangerIfNegative, formatAmount, formatAmountAsWholeNumber } from '../helpers/numbers'
</script>

<style>
.category-amount {
  white-space: nowrap;
  text-align: right;
}

.category-available.danger {
  color: red;
}
.category-available > sup {
  margin-left: 0.5ex;
  margin-right: 0.25ex;
}

.category-budgeted {
	color: #999;
	font-size: 0.8rem;
	vertical-align: bottom;
}

.category-list td {
  border: none;
  vertical-align: middle;
}

.category-name {
  white-space: nowrap;
}

.width-10 {
  width: 10%;
}

.width-80 {
  width: 80%;
}
</style>

<table class="category-list table table-sm">
  <tbody>
    {#each $categories as category }
      <tr>
        <td class="category-name width-10">
          <a href="#/category/{ category.uuid }"
             class="btn btn-outline-secondary">{ category.name }</a>
        </td>
        <td class="width-80">
          <CategoryGraph {category} />
        </td>
        <td class="category-amount width-10">
          <div class="category-available { dangerIfNegative(category.remaining) }">
            <sup>$</sup>{ formatAmount(category.remaining) }
          </div>
          <div class="category-budgeted"><span>/ { formatAmountAsWholeNumber(category.budgetedAmount) }</span></div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
