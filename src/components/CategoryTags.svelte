<script>
import CategoryTag from '../components/CategoryTag.svelte'

export let transaction = {}

$: categoryAmounts = transaction.categoryAmounts || {}
$: categoryIds = Object.keys(categoryAmounts)
</script>

{#each categoryIds as categoryId}
  <CategoryTag {categoryId}
               amount={categoryAmounts[categoryId]} />
{/each}
