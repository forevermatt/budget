<script>
import { startNewPendingTransaction } from '../data/transactions'
import { push } from 'svelte-spa-router'

const timestamp = Date.now()
startNewPendingTransaction({ timestamp })
push(`/expense/who/`)
</script>
