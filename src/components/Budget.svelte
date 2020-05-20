<script>
import { categories } from '../data/categories'
</script>

<ul>
  {#each $categories as category}
    <li>{category.name}: ${category.amount / 100}</li>
  {/each}
</ul>
