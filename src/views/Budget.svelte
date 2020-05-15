<script>
import { categories } from '../data/categories'
</script>

<h2>Budget</h2>

<ul>
  {#each $categories as category}
    <li>{category.name}: ${category.amount / 100}</li>
  {/each}
</ul>

<p><a href="#/category/new">Add new category</a></p>

<p><a href="#/accounts">Accounts</a></p>
