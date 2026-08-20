<script>
import BudgetOverview from '../components/BudgetOverview.svelte'
import Button from '../components/Button.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import { faListUl, faMinus } from '@fortawesome/free-solid-svg-icons'
</script>

<style>
/* Restore along with the settings button below. */
/* #settings-button-container {
  float: right;
} */
</style>

<!--
  Sync configuration is still a work in progress, so the settings button is
  hidden to keep that feature undiscoverable in the deployed app. The
  /settings route still works if visited directly. To restore this, un-comment
  the markup and the style rule above, and add `faCog` back to the icon import.
-->
<!--
<span id="settings-button-container">
  <Button icon={faCog} small url="#/settings" />
</span>
-->
<h2>Budget</h2>

<BudgetOverview />

<p><a href="#/category/new">Add new category</a></p>

<ButtonRow>
  <Button icon={faListUl} name="accounts" url="#/accounts" left />
  <Button icon={faMinus} name="expense" url="#/expense/new" />
</ButtonRow>
