<script>
import Icon from './Icon.svelte'
import { faEnvelope, faListUl } from '@fortawesome/free-solid-svg-icons'
import { router } from 'svelte-spa-router'

// Each tab stands for a whole area of the app, so it lights up for the screens
// under it as well as for its own list. A Transactions tab belongs here too,
// once there is a screen for it to open.
const isUnder = (location, paths) =>
  paths.some(path => (location === path) || location.startsWith(`${ path }/`))

$: onBudget = isUnder(router.location, ['/', '/budget', '/category'])
$: onAccounts = isUnder(router.location, ['/accounts', '/account'])
</script>

<style>
#button-row {
  align-items: center;
  background: #fff;
  border-top: 1px solid #eceef0;
  bottom: 0;
  display: flex;
  gap: 4px;
  left: 0;
  padding: 8px 14px calc(16px + env(safe-area-inset-bottom, 0px));
  position: fixed;
  right: 0;
}

#button-row-spacer {
  height: calc(89px + env(safe-area-inset-bottom, 0px));
}

.tab {
  align-items: center;
  color: #6e7980;
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 12px;
  font-weight: 500;
  gap: 4px;
  padding: 6px 0;
  text-decoration: none;
}

/* Icon.svelte draws at 1em, so the icon is sized by its own font-size rather
   than by the label's. */
.tab-icon {
  font-size: 22px;
  line-height: 1;
}

.tab.active {
  color: #004d69;
  font-weight: 700;
}
</style>

<div id="button-row-spacer"></div>
<nav id="button-row">
  <a class="tab" class:active={onBudget} href="#/budget"
     aria-current={onBudget ? 'page' : undefined}>
    <span class="tab-icon"><Icon icon={faEnvelope} /></span>
    <span>Budget</span>
  </a>
  <a class="tab" class:active={onAccounts} href="#/accounts"
     aria-current={onAccounts ? 'page' : undefined}>
    <span class="tab-icon"><Icon icon={faListUl} /></span>
    <span>Accounts</span>
  </a>
  <slot />
</nav>
