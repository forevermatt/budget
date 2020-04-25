<script>
import { categories } from '../data/categories'
</script>

<h2>Budget</h2>

<ul>
  {#each $categories as category}
    <li>{category.name}: ${category.amount}</li>
  {/each}
</ul>

<a href="#/category/new">Add new category</a>
