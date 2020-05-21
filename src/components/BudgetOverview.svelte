<script>
import { categories } from '../data/categories'

const dangerIfNegative = remaining => isNegative(remaining) ? 'danger' : ''

const formatAmount = amount => {
  if (amount == undefined) {
    amount = 0
  }
  return (Number(amount) / 100).toFixed(2)
}

const formatAmountAsWholeNumber = amount => {
  if (amount == undefined) {
    amount = 0
  }
  return (Number(amount) / 100).toFixed(0)
}

const isNegative = number => (number && (number < 0))

const getStatus = (remaining, total) => {
  if (remaining == undefined) {
    return '';
  } else if (remaining < 0) {
    return 'danger';
  } else if (remaining < (total / 4)) {
    return 'warning';
  }
  return 'success';
}

const calculageWidth = (remaining, total) => {
  if (remaining < 0) {
    return 0;
  } else if (total === 0) {
    return (remaining > 0) ? 100 : 0;
  }
  return (remaining / total) * 100;
}
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

.category-graph {
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.75);
}
.category-graph.danger {
  box-shadow: 0px 0px 0px 1px rgba(255, 0, 0, 0.75);
}

.category-graph,
.category-graph-line {
  border-radius: 4px;
}

.category-graph .danger {
  background-color: red;
}
.category-graph .success {
  background-color: green;
}
.category-graph .warning {
  background-color: orange;
}

.category-graph-line {
	height: 6px;
	margin: auto 0;
}

.category-list td {
  border: none;
  vertical-align: middle;
}

.category-name {
  white-space: nowrap;
}

.category-name > * {
	max-width: 100%;
	overflow: hidden;
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
          <div class="category-graph { dangerIfNegative(category.remaining) }">
            <div class="category-graph-line { getStatus(category.remaining, category.amount) }"
                 style="width: { calculageWidth(category.remaining, category.budgetedAmount) }%;"></div>
          </div>
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
