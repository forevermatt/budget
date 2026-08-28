<script>
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

.tab.active {
  color: #004d69;
  font-weight: 700;
}
</style>

<div id="button-row-spacer"></div>
<nav id="button-row">
  <a class="tab" class:active={onBudget} href="#/budget"
     aria-current={onBudget ? 'page' : undefined}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="14" rx="3" />
      <path d="M2.5 9.5h19M17 15h1.5" />
    </svg>
    <span>Budget</span>
  </a>
  <a class="tab" class:active={onAccounts} href="#/accounts"
     aria-current={onAccounts ? 'page' : undefined}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3.5 10 12 4.5l8.5 5.5M5.5 10.5v8M18.5 10.5v8M3.5 18.5h17" />
    </svg>
    <span>Accounts</span>
  </a>
  <slot />
</nav>
