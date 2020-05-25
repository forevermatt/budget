<script>
import CategoryGraph from './CategoryGraph.svelte'
import { getBudgetFor, sortPlanByCategory } from '../data/budgets'
import { categories } from '../data/categories'
import { getCurrentYearMonthString } from '../helpers/dates'
import { dangerIfNegative, formatAmount, formatAmountAsWholeNumber } from '../helpers/numbers'

export let params = {} // URL parameters provided by router

let yearMonth = params.yearMonth || getCurrentYearMonthString()
$: budget = getBudgetFor(yearMonth)
$: alphabetizedPlan = sortPlanByCategory(budget.plan, $categories)
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
    {#each alphabetizedPlan as {budgeted, spent, category} }
      <tr>
        <td class="category-name width-10">
          <a href="#/category/{ category.uuid }"
             class="btn btn-outline-secondary">{ category.name }</a>
        </td>
        <td class="width-80">
          <CategoryGraph {category} />
        </td>
        <td class="category-amount width-10">
          <div class="category-available { dangerIfNegative(budgeted - spent) }">
            <sup>$</sup>{ formatAmount(budgeted - spent) }
          </div>
          <div class="category-budgeted"><span>/ { formatAmountAsWholeNumber(budgeted) }</span></div>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
