<script>
import { getCategory } from '../data/categories'
import { formatAmount } from '../helpers/numbers'

export let amount = 0
export let categoryId = ''

let name = ''

$: loadCategory(categoryId)

const loadCategory = async (categoryId) => {
  if (categoryId) {
    let category = await getCategory(categoryId)
	name = category.name || ''
  }
}
</script>

<span class="badge text-bg-info">{name}: $ {formatAmount(amount)}</span>
