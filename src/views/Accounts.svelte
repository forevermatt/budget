<script>
import { listAccounts } from '../data/accounts'
import Button from '../components/Button.svelte'
import ErrorMessage from '../components/ErrorMessage.svelte'
import ButtonRow from '../components/ButtonRow.svelte'
import Icon from '../components/Icon.svelte'
import { faChevronRight, faDollarSign, faPlus } from '@fortawesome/free-solid-svg-icons'
import { onMount } from 'svelte'

let accounts = []

onMount(async () => {
  accounts = await listAccounts()
})
</script>

<style>
/* As on the budget overview, the header runs edge to edge and so has to escape
   the padding and top margin of the app-wide container. */
.accounts-header {
  background: var(--primary);
  color: var(--on-primary);
  margin: -1rem calc(var(--bs-gutter-x) * -0.5) 0;
  padding: 18px 20px;
}

.accounts-header h2 {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 0;
}

/* An account stores nothing but its name, so the row has no bar to fill and
   sits taller and quieter than a budget envelope. */
.account-row {
  align-items: center;
  background: var(--surface-container-low);
  border-radius: 13px;
  color: inherit;
  display: flex;
  gap: 10px;
  height: 52px;
  justify-content: space-between;
  padding: 0 14px;
  text-decoration: none;
}

.account-name {
  color: var(--on-surface);
  font-size: 15px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Icon.svelte draws at 1em, so each icon is sized by its own font-size. */
.account-chevron,
.add-account-icon {
  flex: 0 0 auto;
  font-size: 18px;
  line-height: 1;
}

.account-chevron {
  color: var(--outline);
}

/* Keeps the list's rhythm, and stands in for the empty state before there is
   an account to show. */
.add-account {
  align-items: center;
  border: 1px dashed var(--outline-variant);
  border-radius: 13px;
  color: var(--primary-container);
  display: flex;
  font-size: 15px;
  font-weight: 700;
  gap: 8px;
  height: 52px;
  justify-content: center;
  text-decoration: none;
}
</style>

<header class="accounts-header">
  <h2>Accounts</h2>
</header>

<ErrorMessage />

<div class="account-list">
  {#each accounts as { name, _id } (_id)}
    <a class="account-row" href="#/account/{ _id }">
      <span class="account-name">{ name }</span>
      <span class="account-chevron"><Icon icon={faChevronRight} /></span>
    </a>
  {/each}
  <a class="add-account" href="#/account/new">
    <span class="add-account-icon"><Icon icon={faPlus} /></span>
    <span>Add an account</span>
  </a>
</div>

<ButtonRow>
  <Button icon={faDollarSign} name="expense" url="#/expense/new" />
</ButtonRow>
