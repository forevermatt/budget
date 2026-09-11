<script>
import BudgetOverview from '../components/BudgetOverview.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { faDollarSign } from '@fortawesome/free-solid-svg-icons'
</script>

<style>
.add-category {
  font-size: 14px;
  margin: 8px 0 0;
}
</style>

<!--
  Sync configuration is still a work in progress, so this screen offers no way
  in to it and the settings button that used to sit here is gone. The /settings
  route still works if visited directly.
-->
<BudgetOverview />

<p class="add-category"><a href="#/category/new">Add new category</a></p>

<ButtonRow>
  <Button icon={faDollarSign} name="expense" url="#/expense/new" />
</ButtonRow>
