<script>
import CategoryTag from '../components/CategoryTag.svelte'
import { getCategory } from '../data/categories'

export let transaction = {}

$: categoryAmounts = transaction.categoryAmounts || {}
$: categoryUuids = Object.keys(categoryAmounts)
</script>

{#each categoryUuids as categoryUuid}
  <CategoryTag name={getCategory(categoryUuid).name}
               amount={categoryAmounts[categoryUuid]} />
{/each}
