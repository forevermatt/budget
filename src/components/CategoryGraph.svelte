<script>
import { dangerIfNegative } from '../helpers/numbers'

export let category

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
</style>

<div class="category-graph { dangerIfNegative(category.remaining) }">
  <div class="category-graph-line { getStatus(category.remaining, category.amount) }"
       style="width: { calculageWidth(category.remaining, category.budgetedAmount) }%;"></div>
</div>
