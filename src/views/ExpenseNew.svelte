<script>
import { createTransaction } from '../data/transactions'
import { push } from 'svelte-spa-router'

const transaction = createTransaction({
  timestamp: Date.now(),
})
push(`/expense/who/${transaction.uuid}`)
</script>
