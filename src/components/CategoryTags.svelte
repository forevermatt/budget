<script>
import CategoryTag from '../components/CategoryTag.svelte'
import { categories, getCategoryFrom } from '../data/categories'

export let transaction = {}

$: categoryAmounts = transaction.categoryAmounts || {}
$: categoryUuids = Object.keys(categoryAmounts)
</script>

{#each categoryUuids as categoryUuid}
  <CategoryTag name={getCategoryFrom(categoryUuid, $categories).name}
               amount={categoryAmounts[categoryUuid]} />
{/each}
