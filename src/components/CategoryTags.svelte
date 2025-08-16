<script>
import CategoryTag from '../components/CategoryTag.svelte'
import { getCategory } from '../data/categories'

export let transaction = {}

$: categoryAmounts = transaction.categoryAmounts || {}
$: categoryIds = Object.keys(categoryAmounts)
</script>

{#each categoryIds as categoryId}
  <CategoryTag name={getCategory(categoryId).name}
               amount={categoryAmounts[categoryId]} />
{/each}
