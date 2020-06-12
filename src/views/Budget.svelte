<script>
import BudgetOverview from '../components/BudgetOverview.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { faListUl } from '@fortawesome/free-solid-svg-icons'
</script>

<h2>Budget</h2>

<BudgetOverview />

<p><a href="#/category/new">Add new category</a></p>

<ButtonRow>
  <Button icon={faListUl} name="accounts" url="#/accounts" left />
</ButtonRow>
