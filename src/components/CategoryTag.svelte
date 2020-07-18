<script>
import { formatAmount } from '../helpers/numbers'

export let name = ''
export let amount = 0
</script>

<span class="badge badge-info">{name}: $ {formatAmount(amount)}</span>
