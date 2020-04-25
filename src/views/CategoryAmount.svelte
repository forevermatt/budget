<script>
import { categories } from '../data/categories'

export let params // URL parameters provider by router.

$: uuid = params.uuid
$: category = $categories.find(category => category.uuid === uuid) || {}
</script>

<h1>Amount for {category.name}</h1>

